// import { SheetDefinition, SheetRegister } from 'react-native-actions-sheet';
// import KebabBottomSheet from './Action.tsx';
 
// type KebabSheetPayload = {
//   name: string;
// };
 
// // We extend some of the types here to give us great intellisense
// // across the app for all registered sheets.
// declare module 'react-native-actions-sheet' {
//   interface Sheets {
//     'kebab-bottomsheet': SheetDefinition<{
//       payload: KebabSheetPayload;
//     }>;
//   }
// }
 
// export const Sheets = () => {
//   return <SheetRegister sheets={{'kebab-bottomsheet': KebabBottomSheet}} />
// }
// sheets.tsx
import { SheetDefinition, SheetRegister } from 'react-native-actions-sheet';
import KebabBottomSheet from './Action.tsx';

type KebabSheetPayload = {
  name: string;
  uri?: string;
  id?: string;
  type: "video" | "folder" | "all_videos"; // 👈 add type
  isDirectory: boolean;
  fileName: string;
  path: string
  count: number,
  route: string,
  root: string
};

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'kebab-bottomsheet': SheetDefinition<{
      payload: KebabSheetPayload;
    }>;
  }
}

export const Sheets = () => {
  return <SheetRegister sheets={{'kebab-bottomsheet': KebabBottomSheet}} />
}