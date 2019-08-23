import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faSearch, faUser as farUser, faPuzzlePiece,
  faHeart as farHeart, faCog as farCog, faCalendar as farCalendar
} from '@fortawesome/pro-regular-svg-icons'
import {
  faAngleDoubleRight, faSignIn, faHeart, faMugHot, faUserAlt,
  faLock, faAddressCard, faUserFriends, faAnalytics, faChartNetwork, faArchive, faLink,
  faSortAmountDown, faSortAmountUp, faDownload, faBriefcase, faSave, faCircle, faEdit, faCalendar, faFileEdit,
  faSuitcase, faLanguage, faTrash, faStar, faUser, faSpinner, faEnvelope,
  faUpload, faFileArchive, faCheckCircle, faExclamationTriangle, faEyeSlash, faGlobe,
  faPaperPlane, faChevronUp, faChevronLeft, faPlus, faPlay, faPause,
} from '@fortawesome/pro-solid-svg-icons'
import { faAppStore, faGooglePlay, faGoogle, faFacebookF, faDiscord } from '@fortawesome/free-brands-svg-icons'

export default function () {
  config.autoAddCss = false
  Vue.component('font-awesome-icon', FontAwesomeIcon)
  library.add(
    faSearch, farUser, faPuzzlePiece, farHeart, farCog, farCalendar,
    faAngleDoubleRight, faSignIn, faHeart, faMugHot, faUserAlt, faLock,
    faAddressCard, faUserFriends, faAnalytics, faChartNetwork, faArchive, faLink,
    faSortAmountDown, faSortAmountUp, faDownload, faBriefcase,
    faSave, faCircle, faEdit, faCalendar, faFileEdit,
    faSuitcase, faLanguage, faTrash, faStar, faUser, faSpinner,
    faEnvelope, faUpload, faFileArchive, faCheckCircle, faExclamationTriangle, faEyeSlash, faGlobe,
    faPaperPlane, faChevronUp, faChevronLeft, faPlus, faPlay, faPause,
    faAppStore, faGooglePlay, faGoogle, faFacebookF, faDiscord
  )
}
