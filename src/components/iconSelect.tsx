import { Select } from 'antd';
import * as AntIcons from '@ant-design/icons';
import './IconSelect.css'; // 引入样式文件

const IconSelect = ({ value, onChange }: { value?: string; onChange?: (v: string) => void }) => {
  const iconList = Object.keys(AntIcons).filter((key) =>
    key.endsWith('Outlined')
  );

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="选择图标"
      style={{ width: '100%' }}
      showSearch
      filterOption={(input, option) =>
        !!option?.value &&
        option.value.toString().toLowerCase().includes(input.toLowerCase())
      }
    >
      {iconList.map((name) => {
        const Icon = (AntIcons as any)[name];
        return (
          <Select.Option key={name} value={name}>
            <div className="icon-option">
              <Icon className="icon-item" />
              <span>{name}</span>
            </div>
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default IconSelect;