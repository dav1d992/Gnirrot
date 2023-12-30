// import { createActionGroup, emptyProps, props } from '@ngrx/store';
// import { DateTime } from 'luxon';

// const dialogEvents = {
//   'Open confirm dialog': props<{
//     header: string;
//     messages: string[];
//     callback: any;
//   }>(),
//   'Close confirm dialog': emptyProps(),
//   'Open accept dialog': props<{
//     header: string;
//     messages: string[];
//     acceptCallback: any;
//     rejectCallback: any;
//   }>(),
//   'Close accept dialog': emptyProps(),
//   'Open acknowledge dialog': props<{
//     header: string;
//     messages: string[];
//     callback: any;
//   }>(),
//   'Close acknowledge dialog': emptyProps(),
//   'Open save plan as template dialog': emptyProps(),
//   'Close save plan as template dialog': emptyProps(),
//   'Open manage plan templates dialog': emptyProps(),
//   'Close manage plan templates dialog': emptyProps(),
// };

// export const uiActions = createActionGroup({
//   source: 'UI',
//   events: {
//     'Set selected dates': props<{ selectedDates: DateTime[] }>(),
//     'Set selected date range': props<{ selectedDateRange: string[] }>(),
//     // 'Set selected language': props<{ selectedLanguage: Language }>(),
//     'Set menu collapsed': props<{ collapsed: boolean }>(),
//     'Set bids panel expanded': props<{ expanded: boolean }>(),
//     'Add selected bid': props<{ bid: SelectedBid }>(),
//     'Remove selected bid': props<{ bidId: string }>(),
//     'Clear selected bids': emptyProps(),
//     'Set show inactive assets': props<{ showInactiveAssets: boolean }>(),
//     'Set selected unit ids': props<{ unitIds: number[] }>(),
//     'Set selected storage ids': props<{ storageIds: number[] }>(),
//     'Set user roles': props<{ roles: string[] }>(),
//     'Set editing bid': props<{ bid: SelectedBid }>(),
//     'Clear editing bid': emptyProps,
//     ...dialogEvents,
//   },
// });
