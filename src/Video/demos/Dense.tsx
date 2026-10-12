import { Video } from '@lobehub/ui';

import { denseSections, SAMPLE_SRC } from './data';

export default () => <Video maxHeight={360} sections={denseSections} src={SAMPLE_SRC} />;
