import { Injectable, inject } from '@angular/core';
import { PlanningApiService } from '@feature/heating/services/planning-api.service';
import { Provide } from '@helpers/provide';
import { PlanTemplate } from '@models/plan';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { planTemplateActions } from '@store/features/plan-template/plan-template.actions';
import { exhaustMap, mergeMap } from 'rxjs';

export interface BidBase {
	date: string;
	unitId: number;
}
@Injectable()
export class PlanTemplateEffects {
	private readonly actions$ = inject(Actions);
	private readonly planningApiService = inject(PlanningApiService);
	private readonly store = inject(Store);

	public loadPlanTemplates$ = createEffect(() =>
		this.actions$.pipe(
			ofType(planTemplateActions.getPlanTemplates),
			exhaustMap(({ assetId }) =>
				this.planningApiService.getPlanTemplates$(Provide.PlanningQueryParams.withAssetId(assetId).build()).pipe(
					mergeMap((templates: PlanTemplate[]) => {
						const actions: Action[] = [];
						actions.push(planTemplateActions.setPlanTemplates({ templates }));
						return actions;
					}),
				),
			),
		),
	);
}
