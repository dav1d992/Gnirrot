import { toDateFormat } from '@helpers/toDate';
import { createSelector } from '@ngrx/store';
import { ValidationError } from '@services/planning-validation.service';
import { assetFeature } from '@store/features/asset';
import { planValidationFeature } from '@store/features/plan-validation/plan-validation.feature';
import { uiFeature } from '@store/features/ui';

export const selectPlanValidationErrors = () =>
	createSelector(
		assetFeature.selectCurrentAsset,
		uiFeature.selectSelectedDates,
		selectPowerPlanValidationErrors(),
		selectHeatPlanValidationErrors(),
		(currentAsset, selectedDates, powerPlanValidationErrors, heatPlanValidationErrors): ValidationError[] => {
			if (!currentAsset || Object.keys(currentAsset).length === 0) return [];

			const validationErrors = [...powerPlanValidationErrors, ...heatPlanValidationErrors];

			return validationErrors || [];
		},
	);

export const selectPowerPlanValidationErrors = () =>
	createSelector(
		assetFeature.selectCurrentAsset,
		uiFeature.selectSelectedDates,
		planValidationFeature.selectPlanvalidationState,
		(currentAsset, selectedDates, planValidationState): ValidationError[] => {
			if (!currentAsset || Object.keys(currentAsset).length === 0) return [];

			const planningDate = toDateFormat(selectedDates[0]);
			const assetData = planValidationState[currentAsset.PlantId];

			return assetData?.[planningDate]?.powerValidationErrors || [];
		},
	);
export const selectHeatPlanValidationErrors = () =>
	createSelector(
		assetFeature.selectCurrentAsset,
		uiFeature.selectSelectedDates,
		planValidationFeature.selectPlanvalidationState,
		(currentAsset, selectedDates, planValidationState): ValidationError[] => {
			if (!currentAsset || Object.keys(currentAsset).length === 0) return [];

			const planningDate = toDateFormat(selectedDates[0]);
			const assetData = planValidationState[currentAsset.PlantId];

			return assetData?.[planningDate]?.heatValidationErrors || [];
		},
	);
