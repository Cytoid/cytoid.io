import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faAngleDoubleRight, faSignIn, faSignOut, faHeart, faMugHot, faUserAlt, faSearch, faCog,
  faLock, faAddressCard, faUserFriends, faAnalytics, faChartNetwork, faArchive, faLink,
  faSortAmountDown, faSortAmountUp, faDownload, faBriefcase, faSave, faCircle, faEdit, faCalendar, faFileEdit,
  faSuitcase, faLanguage, faTrash, faStar, faUser, faSpinner, faEnvelope,
  faUpload, faFileArchive, faCheckCircle, faExclamationTriangle, faEyeSlash, faGlobe,
  faPaperPlane, faChevronUp, faChevronLeft, faPlus, faMinus, faPlay, faPause,
  faPuzzlePiece, faTimes, faChimney,
  faUserCog, faUserTie, faFileAlt,
  faAngleRight, faAngleLeft, faArrowDown, faArrowUp, faTag,
  faExclamationCircle, faCheck, faCaretDown, faCaretUp, faEmptySet,
  faAlbum, faAlbumCollection, faTimesCircle, faExchange, faReply, faChevronDown,
  faUserSecret,
} from '@fortawesome/pro-solid-svg-icons'

import {
  faHeart as faHeartLight,
} from '@fortawesome/pro-light-svg-icons'
import {
  faAppStore, faGooglePlay, faGoogle, faFacebookF, faDiscord, faPatreon,
} from '@fortawesome/free-brands-svg-icons'

export default function () {
  config.autoAddCss = false
  Vue.component('font-awesome-icon', FontAwesomeIcon)
  library.add(
    faSearch, faPuzzlePiece, faCog,
    faAngleDoubleRight, faSignIn, faSignOut, faHeart, faMugHot, faUserAlt, faLock,
    faAddressCard, faUserFriends, faAnalytics, faChartNetwork, faArchive, faLink,
    faSortAmountDown, faSortAmountUp, faDownload, faBriefcase,
    faSave, faCircle, faEdit, faCalendar, faFileEdit,
    faSuitcase, faLanguage, faTrash, faStar, faUser, faSpinner,
    faEnvelope, faUpload, faFileArchive, faCheckCircle, faExclamationTriangle, faEyeSlash, faGlobe,
    faPaperPlane, faChevronUp, faChevronLeft, faPlus, faMinus, faPlay, faPause,
    faAppStore, faGooglePlay, faGoogle, faFacebookF, faDiscord, faPatreon,
    faTimes, faChimney,
    faUserCog, faUserTie, faFileAlt,
    faAngleRight, faAngleLeft, faArrowDown, faArrowUp, faTag,
    faExclamationCircle, faCheck, faCaretDown, faCaretUp, faEmptySet,
    faAlbum, faAlbumCollection, faTimesCircle, faExchange, faHeartLight, faReply, faChevronDown,
    faUserSecret,
  )
}
