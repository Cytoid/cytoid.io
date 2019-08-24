import Vue from 'vue'
import {
  Button, Card, Divider, Upload, Select,
  Row, Col, Spin, Table, Tag,
  Pagination, Rate, Radio,
  Input, InputNumber, Form,
  Popover, AutoComplete,
  Menu, Dropdown, Tooltip, Badge,
  Progress, Checkbox, List, DatePicker,
  Modal,
  message
} from 'ant-design-vue'
import Avatar from '@/components/Avatar'

function getMessage(err) {
  if (err.response?.status === 404) {
    return 'Resource Not Found'
  }
  return err.response?.data.message ||
    err.response?.data.name ||
    err.response?.data ||
    err.message || 'Unknown Error'
}

export function handleErrorBlock(err, handler) {
  return handler({
    statusCode: err.response?.status || 502,
    message: getMessage(err),
  })
}

export default function ({ store, $axios, error }) {
  [
    Button,
    Card,
    Divider,
    Upload,
    Upload.Dragger,
    Select,
    Select.Option,
    Row, Col,
    Spin,
    Table,
    Tag,
    Pagination,
    Rate,
    Radio.Group,
    Radio.Button,
    Input,
    InputNumber,
    Form,
    Form.Item,
    Popover,
    Menu,
    Menu.Item,
    AutoComplete,
    Dropdown,
    Badge,
    Tooltip,
    Progress,
    Checkbox,
    List,
    List.Item,
    DatePicker,
    Modal,
  ].forEach(comp => Vue.component(comp.name, comp))

  Vue.prototype.$message = message

  Vue.component('avatar', Avatar)

  // Global error handlers
  Vue.mixin({
    methods: {
      handleErrorBlock(err) {
        return handleErrorBlock(err, error)
      },
      handleErrorToast(err) {
        this.$message.error(getMessage(err))
      }
    }
  })
}
