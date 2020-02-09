import Vue from 'vue'
import {
  Input,
  Tag,
  Taginput,
  Field,
  Autocomplete,
  Dropdown,
  Upload,
  Icon,
  Progress,
} from 'buefy'

export default function () {
  [
    Input,
    Tag,
    Taginput,
    Field,
    Autocomplete,
    Dropdown,
    Upload,
    Icon,
    Progress,
  ].forEach(Vue.use.bind(Vue))
}
