import { EnrichedUnit } from '@models/unit.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { assetFeature } from '@store/features/asset';
import { UnitsState } from '@store/features/units/units.feature';

const selectUnitState = createFeatureSelector<UnitsState>('units');

export const selectEnrichedUnitsState = () =>
	createSelector(selectUnitState, assetFeature.selectCurrentAsset, (unitsState, currentAsset) => {
		if (Object.keys(currentAsset).length === 0) return {};

		const enrichedUnitsState: {
			[unitId: string]: EnrichedUnit;
		} = { ...unitsState } as any;

		Object.keys(unitsState).forEach((unitId) => {
			const unit = unitsState[unitId];
			const foundTurbine = currentAsset.Turbines.find((turbine) => turbine.TurbineId === unit.UnitId);

			// Decorate unit with options from turbine
			if (foundTurbine !== undefined) {
				enrichedUnitsState[unitId] = {
					...unit,
					SubmissionType: foundTurbine.SubmissionType,
					IsActive: foundTurbine.IsActive,
					MaxPowerCapacity: foundTurbine.MaxPowerCapacity,
					MinPowerCapacity: foundTurbine.MinPowerCapacity,
					PrimaryReserveMaxEffect: foundTurbine.PrimaryReserveMaxEffect,
					PrimaryReserveMaxEffectDown: foundTurbine.PrimaryReserveMaxEffectDown,
					FcrNMaxEffectUp: foundTurbine.FcrNMaxEffectUp,
					FcrNMaxEffectDown: foundTurbine.FcrNMaxEffectDown,
					FcrDMaxEffectUp: foundTurbine.FcrDMaxEffectUp,
					FcrDMaxEffectDown: foundTurbine.FcrDMaxEffectDown,
					FastFrequencyReserveMaxEffect: foundTurbine.FastFrequencyReserveMaxEffect,
				};
			}
		});

		return enrichedUnitsState;
	});
