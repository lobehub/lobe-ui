import type { TranslationResources } from '../types';
import chat from './chat';
import common from './common';
import editableMessage from './editableMessage';
import emojiPicker from './emojiPicker';
import form from './form';
import hotkey from './hotkey';
import messageModal from './messageModal';
import sideNav from './sideNav';

const allResources: TranslationResources[] = [
  chat,
  common,
  editableMessage,
  emojiPicker,
  form,
  hotkey,
  messageModal,
  sideNav,
];

export { allResources };
export default allResources;
