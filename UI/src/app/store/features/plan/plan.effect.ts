import { Injectable, inject } from '@angular/core';
import { PlanningApiService } from '@feature/heating/services/planning-api.service';
import { Provide } from '@helpers/provide';
import { toDateFormat } from '@helpers/toDate';
import { Plan } from '@models/plan';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { HeatingApiService } from '@services/rest/heating-api.service';
import { getPlanActions } from '@store/features/plan/helpers/getPlanActions.helper';
import { planActions } from '@store/features/plan/plan.actions';
import { DateTime } from 'luxon';
import { EMPTY, catchError, exhaustMap, finalize, forkJoin, from, map, mergeMap, of, tap } from 'rxjs';

export interface BidBase {
	date: string;
	unitId: number;
}

@Injectable()
export class PlanEffects {
	private readonly store = inject(Store);
	private readonly actions$ = inject(Actions);
	private readonly planningApiService = inject(PlanningApiService);
	private readonly heatingApiService = inject(HeatingApiService);

	public loadPlan$ = createEffect(() =>
		this.actions$.pipe(
			ofType(planActions.getPlan),
			tap(() => {
				this.store.dispatch(planActions.clearPlan()); // Sets loading to true per default
			}),
			tap(({ assetId, productionDates }) => {
				productionDates.forEach((date) => {
					this.store.dispatch(planActions.setIsLoading({ assetId: assetId, date: toDateFormat(date), isLoading: true }));
				});
			}),
			exhaustMap(({ assetId, productionDates }) =>
				this.planningApiService
					.getPlans$(
						Provide.PlanningQueryParams.withAssetId(assetId)
							.withProductionDate(productionDates[0].toISODate())
							.withEndDate(productionDates[productionDates.length - 1].toISODate())
							.build(),
					)
					.pipe(
						mergeMap((plans: Plan[]) => from(plans.flatMap((plan) => getPlanActions(plan)))),
						finalize(() =>
							productionDates.forEach((date) => {
								this.store.dispatch(planActions.setIsLoading({ assetId: assetId, date: toDateFormat(date), isLoading: false }));
							}),
						),
					),
			),
		),
	);

	public postHeatingBids$ = createEffect(() =>
		this.actions$.pipe(
			ofType(planActions.requestPostHeatBids),
			mergeMap(({ assetId, date, bids }) =>
				this.heatingApiService.postHeatingBids(assetId, bids, date).pipe(
					mergeMap((newBids) => {
						const actions: Action[] = [];
						actions.push(planActions.removeDirtyHeatBids({ assetId, date, bidIds: bids.map((bid) => bid.id) }));

						return actions;
					}),
					catchError(() => {
						return EMPTY;
					}),
				),
			),
		),
	);

	public postExtendHeatingBids$ = createEffect(() =>
		this.actions$.pipe(
			ofType(planActions.requestPostExtendHeatBids),
			mergeMap(({ assetId, startDate, endDate, bids }) => {
				const start = DateTime.fromISO(startDate);
				const end = DateTime.fromISO(endDate);
				for (let date = start; date <= end; date = date.plus({ day: 1 })) {
					this.store.dispatch(planActions.clearHeatBids({ date: toDateFormat(date) }));
				}

				const actions: Action[] = [];
				return this.heatingApiService.postHeatingBids(assetId, bids, startDate, endDate).pipe(
					mergeMap(() => {
						return actions;
					}),
					catchError(() => {
						return EMPTY;
					}),
				);
			}),
		),
	);

	public updateHeatingBids$ = createEffect(() =>
		this.actions$.pipe(
			ofType(planActions.requestUpdateHeatBids),
			mergeMap(({ assetId, date, bids }) => {
				const updateCalls = bids.map((bid) =>
					this.heatingApiService
						.updateHeatBid(bid.id, {
							Effect: {
								Value: bid.effect.value,
								Unit: bid.effect.unit,
							},
						})
						.pipe(
							map(() => {
								return planActions.removeDirtyHeatBid({ assetId: assetId, date: date, bidId: bid.id });
							}),
							catchError(() => {
								return EMPTY;
							}),
						),
				);

				return forkJoin(updateCalls).pipe(mergeMap((actions) => of(...actions)));
			}),
		),
	);

	public deleteHeatingBids$ = createEffect(() =>
		this.actions$.pipe(
			ofType(planActions.requestDeleteHeatBids),
			mergeMap(({ assetId, date, bids }) =>
				this.heatingApiService.deleteHeatingBids(bids.map((bid) => bid.Id)).pipe(
					mergeMap(() => {
						const actions: Action[] = [];

						bids.forEach((bid) => {
							actions.push(planActions.removeHeatBid({ assetId: assetId, date: date, bidId: bid.Id }));
						});

						return actions;
					}),
					catchError(() => {
						return EMPTY;
					}),
				),
			),
		),
	);
}
