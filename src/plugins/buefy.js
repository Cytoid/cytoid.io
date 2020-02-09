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
  Button,
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
    Button,
  ].forEach(Vue.use.bind(Vue))
}
