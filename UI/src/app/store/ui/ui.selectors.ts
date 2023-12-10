// import { createSelector } from '@ngrx/store';
// import { UiState, selectUiState, uiFeature } from '@store/ui/ui.feature';

// export const selectSpecificBidFromSelected = (bidId: string) =>
//   createSelector(uiFeature.selectSelectedBids, (bids) => {
//     return bids.find((bid) => bid.id === bidId);
//   });

// export const selectHasRoleReadonly = createSelector(
//   selectUiState,
//   (state: UiState) => state.userRoles.includes('readonly')
// );
// export const selectConfirmDialogState = createSelector(
//   selectUiState,
//   (state: UiState) => state.dialogState.confirm
// );
// export const selectAcknowledgeDialogState = createSelector(
//   selectUiState,
//   (state: UiState) => state.dialogState.acknowledge
// );
// export const selectSavePlanAsTemplateDialogState = createSelector(
//   selectUiState,
//   (state: UiState) => state.dialogState.savePlanAsTemplate
// );
// export const selectManagePlanTemplatesDialogState = createSelector(
//   selectUiState,
//   (state: UiState) => state.dialogState.managePlanTemplates
// );
// export const selectAcceptDialogState = createSelector(
//   selectUiState,
//   (state: UiState) => state.dialogState.accept
// );
