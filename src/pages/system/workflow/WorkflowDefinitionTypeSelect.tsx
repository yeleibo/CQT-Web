import {
  getWorkflowDefinitionTypeLabel,
  WorkflowDefinitionType,
} from '@/pages/system/workflow/typings';
import { Select } from 'antd';

const WorkflowDefinitionTypeSelect: React.FC<{
  onChange: (value: WorkflowDefinitionType) => void;
  value?: WorkflowDefinitionType;
}> = ({ onChange, value }) => {
  return (
    <Select onChange={(value) => onChange(value as WorkflowDefinitionType)} value={value}>
      {Object.values(WorkflowDefinitionType)
        .filter((value) => typeof value === 'number') // 过滤枚举的反向映射
        .map((value) => (
          <Select.Option key={value} value={value}>
            {getWorkflowDefinitionTypeLabel(value as WorkflowDefinitionType)}
          </Select.Option>
        ))}
    </Select>
  );
};

export default WorkflowDefinitionTypeSelect;
