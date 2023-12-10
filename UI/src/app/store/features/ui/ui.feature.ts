import { AlertType } from '@components/alert/alert.component';
import { BidType } from '@components/bid-type/bid-type.component';
import { DirtyStateType } from '@feature/heating/services/planning-api.service';
import { deepObjectMerge } from '@helpers/deepObjectMerge';
import { Language } from '@models/enums/language.enum';
import { createFeature, createReducer, on } from '@ngrx/store';
import { DateTime } from 'luxon';
import { uiActions } from './ui.actions';

// Get last selected date
const isDevelopment = process.env.NODE_ENV === 'development';
const localStorageSelectedDates = isDevelopment ? localStorage.getItem('lastSelectedDates') : sessionStorage.getItem('lastSelectedDates');
const localStorageSelectedDateRange = isDevelopment ? localStorage.getItem('lastSelectedDateRange') : sessionStorage.getItem('lastSelectedDateRange');
const localStorageShowInactiveAssets = localStorage.getItem('lastShowInactiveAssets');
const localStorageMenuCollapsed = localStorage.getItem('menuCollapsed');
const localStorageBidsPanelExpanded = localStorage.getItem('bidsPanelExpanded');

export interface ConfirmDialogState {
	isOpen: boolean;
	header: string;
	messages: string[];
	callback?: () => void;
	severity?: AlertType;
}

export interface AcknowledgeDialogState {
	isOpen: boolean;
	header: string;
	messages: string[];
	callback?: () => void;
	severity?: AlertType;
}

export interface SavePlanAsTemplateDialogState {
	isOpen: boolean;
}

export interface ManagePlanTemplatesDialogState {
	isOpen: boolean;
}

export interface AcceptDialogState {
	isOpen: boolean;
	header: string;
	messages: string[];
	acceptCallback?: () => void;
	rejectCallback?: () => void;
	severity?: AlertType;
}

export interface DialogState {
	confirm: ConfirmDialogState;
	acknowledge: AcknowledgeDialogState;
	accept: AcceptDialogState;
	savePlanAsTemplate: SavePlanAsTemplateDialogState;
	managePlanTemplates: ManagePlanTemplatesDialogState;
}

export type SelectedBid = {
	id: string;
	type: BidType;
	dirtyState: DirtyStateType;
};

export interface UiState {
	selectedDates: DateTime[];
	selectedDateRange: string[];
	selectedLanguage: Language;
	selectedBids: SelectedBid[];
	showInactiveAssets: boolean;
	menuCollapsed: boolean;
	bidsPanelExpanded: boolean;
	selectedUnitIds: number[];
	selectedStorageIds: number[];
	userRoles: string[];
	editingBid: SelectedBid;
	dialogState: DialogState;
}

const dialogEmptyState: DialogState = {
	confirm: { isOpen: false, header: '', messages: [] },
	acknowledge: { isOpen: false, header: '', messages: [] },
	accept: { isOpen: false, header: '', messages: [] },
	savePlanAsTemplate: { isOpen: false },
	managePlanTemplates: { isOpen: false },
};

const initialState: UiState = {
	selectedDates: localStorageSelectedDates
		? JSON.parse(localStorageSelectedDates).map((date: string) => DateTime.fromISO(date))
		: [DateTime.local().set({ hour: 0, minute: 0, second: 0 })],
	selectedDateRange: localStorageSelectedDateRange ? JSON.parse(localStorageSelectedDateRange) : [],
	selectedLanguage: Language.DA,
	selectedBids: [],
	showInactiveAssets: localStorageShowInactiveAssets ? JSON.parse(localStorageShowInactiveAssets) : false,
	menuCollapsed: localStorageMenuCollapsed ? JSON.parse(localStorageMenuCollapsed) : false,
	bidsPanelExpanded: localStorageBidsPanelExpanded ? JSON.parse(localStorageBidsPanelExpanded) : false,
	selectedUnitIds: [],
	selectedStorageIds: [],
	userRoles: [],
	editingBid: {} as SelectedBid,
	dialogState: dialogEmptyState,
};

export const uiFeature = createFeature({
	name: 'ui',
	reducer: createReducer(
		initialState,

		on(uiActions.setSelectedDates, (state, { selectedDates }) => {
			if (isDevelopment) {
				localStorage.setItem('lastSelectedDates', JSON.stringify(selectedDates));
			} else {
				sessionStorage.setItem('lastSelectedDates', JSON.stringify(selectedDates));
			}
			return deepObjectMerge(state, { selectedDates }, false);
		}),
		on(uiActions.setSelectedDateRange, (state, { selectedDateRange }) => {
			if (isDevelopment) {
				localStorage.setItem('lastSelectedDateRange', JSON.stringify(selectedDateRange));
			} else {
				sessionStorage.setItem('lastSelectedDateRange', JSON.stringify(selectedDateRange));
			}
			return { ...state, selectedDateRange };
		}),
		on(uiActions.setSelectedLanguage, (state, { selectedLanguage }) => deepObjectMerge(state, { selectedLanguage })),
		on(uiActions.addSelectedBid, (state, { bid }) => {
			// Do not add redundant copies
			if (state.selectedBids.some((selectedBid) => selectedBid.id === bid.id)) {
				return { ...state };
			}
			return deepObjectMerge(state, { selectedBids: [bid] });
		}),
		on(uiActions.removeSelectedBid, (state, { bidId }) => {
			const modifiedSelectedBids = [...state.selectedBids];
			const bid = modifiedSelectedBids.find((selectedBid) => selectedBid.id === bidId);
			if (bid === undefined) return { ...state, selectedBids: modifiedSelectedBids };

			const index = modifiedSelectedBids.indexOf(bid);

			if (index > -1) {
				modifiedSelectedBids.splice(index, 1);
			}

			return { ...state, selectedBids: modifiedSelectedBids };
		}),
		on(uiActions.clearSelectedBids, (state) => ({ ...state, selectedBids: [] })),
		on(uiActions.setShowInactiveAssets, (state, { showInactiveAssets }) => {
			localStorage.setItem('lastShowInactiveAssets', JSON.stringify(showInactiveAssets));
			return deepObjectMerge(state, { showInactiveAssets });
		}),
		on(uiActions.setMenuCollapsed, (state, { collapsed }) => {
			localStorage.setItem('menuCollapsed', JSON.stringify(collapsed));

			return { ...state, menuCollapsed: collapsed };
		}),
		on(uiActions.setBidsPanelExpanded, (state, { expanded }) => {
			localStorage.setItem('bidsPanelExpanded', JSON.stringify(expanded));

			return { ...state, bidsPanelExpanded: expanded };
		}),
		on(uiActions.setSelectedUnitIds, (state, { unitIds }) => {
			return { ...state, selectedUnitIds: unitIds };
		}),
		on(uiActions.setSelectedStorageIds, (state, { storageIds }) => {
			return { ...state, selectedStorageIds: storageIds };
		}),
		on(uiActions.setUserRoles, (state, { roles }) => {
			return { ...state, userRoles: roles };
		}),
		on(uiActions.openConfirmDialog, (state, { header, messages, callback, severity }) => {
			return deepObjectMerge(
				state,
				{
					dialogState: {
						confirm: {
							isOpen: true,
							header,
							messages,
							callback,
							severity,
						},
					},
				},
				false,
			);
		}),
		on(uiActions.closeConfirmDialog, (state) => {
			return deepObjectMerge(
				state,
				{
					dialogState: {
						confirm: {
							isOpen: false,
							header: '',
							messages: [],
							callback: null,
							severity: undefined,
						},
					},
				},
				false,
			);
		}),
		on(uiActions.openAcknowledgeDialog, (state, { header, messages, callback, severity }) => {
			return deepObjectMerge(
				state,
				{
					dialogState: {
						acknowledge: {
							isOpen: true,
							header,
							messages,
							callback,
							severity,
						},
					},
				},
				false,
			);
		}),
		on(uiActions.closeAcknowledgeDialog, (state) => {
			return deepObjectMerge(
				state,
				{
					dialogState: {
						acknowledge: {
							isOpen: false,
							header: '',
							messages: [],
							callback: null,
							severity: undefined,
						},
					},
				},
				false,
			);
		}),
		on(uiActions.openSavePlanAsTemplateDialog, (state) => {
			return deepObjectMerge(
				state,
				{
					dialogState: {
						savePlanAsTemplate: {
							isOpen: true,
						},
					},
				},
				false,
			);
		}),
		on(uiActions.closeSavePlanAsTemplateDialog, (state) => {
			return deepObjectMerge(
				state,
				{
					dialogState: {
						savePlanAsTemplate: {
							isOpen: false,
						},
					},
				},
				false,
			);
		}),
		on(uiActions.openManagePlanTemplatesDialog, (state) => {
			return deepObjectMerge(
				state,
				{
					dialogState: {
						managePlanTemplates: {
							isOpen: true,
						},
					},
				},
				false,
			);
		}),
		on(uiActions.closeManagePlanTemplatesDialog, (state) => {
			return deepObjectMerge(
				state,
				{
					dialogState: {
						managePlanTemplates: {
							isOpen: false,
						},
					},
				},
				false,
			);
		}),
		on(uiActions.openAcceptDialog, (state, { header, messages, acceptCallback, rejectCallback, severity }) => {
			return deepObjectMerge(
				state,
				{
					dialogState: {
						accept: {
							isOpen: true,
							header,
							messages,
							acceptCallback,
							rejectCallback,
							severity,
						},
					},
				},
				false,
			);
		}),
		on(uiActions.closeAcceptDialog, (state) => {
			return deepObjectMerge(
				state,
				{
					dialogState: {
						accept: {
							isOpen: false,
							header: '',
							messages: [],
							acceptCallback: null,
							rejectCallback: null,
							severity: undefined,
						},
					},
				},
				false,
			);
		}),

		on(uiActions.setEditingBid, (state, { bid }) => {
			return { ...state, editingBid: bid };
		}),
		on(uiActions.clearEditingBid, (state) => {
			return { ...state, editingBid: {} as SelectedBid };
		}),
	),
});

export const {
	name,
	reducer,
	selectSelectedDates,
	selectSelectedDateRange,
	selectSelectedBids,
	selectSelectedLanguage,
	selectBidsPanelExpanded,
	selectMenuCollapsed,
	selectUiState,
	selectShowInactiveAssets,
	selectSelectedUnitIds,
	selectUserRoles,
} = uiFeature;
