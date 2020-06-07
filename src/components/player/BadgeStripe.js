import {
  faUserRobot, faStar, faStars, faUserTie,
  faBaby, faSearch, faUserHeadset, faUserCrown,
  faAward, faMedal, faTrophy, faSchool, faGraduationCap,
  faDiploma, faDiceOne, faDiceTwo, faDiceThree, faBalanceScale,
  faDice, faHeart, faEquals, faMehRollingEyes, faFan, faQuestion,
  faFillDrip, faCertificate, faStamp, faStarShooting, faLemon,
} from '@fortawesome/pro-duotone-svg-icons'
import {
  faPatreon, faHackerrank
} from '@fortawesome/free-brands-svg-icons'

const icons = {
  fad: {
    'user-robot': faUserRobot,
    star: faStar,
    stars: faStars,
    'user-tie': faUserTie,
    baby: faBaby,
    search: faSearch,
    'user-headset': faUserHeadset,
    'user-crown': faUserCrown,
    award: faAward,
    medal: faMedal,
    trophy: faTrophy,
    school: faSchool,
    'graduation-cap': faGraduationCap,
    diploma: faDiploma,
    'dice-one': faDiceOne,
    'dice-two': faDiceTwo,
    'dice-three': faDiceThree,
    'balance-scale': faBalanceScale,
    dice: faDice,
    heart: faHeart,
    equals: faEquals,
    'meh-rolling-eyes': faMehRollingEyes,
    fan: faFan,
    question: faQuestion,
    'fill-drip': faFillDrip,
    certificate: faCertificate,
    stamp: faStamp,
    'star-shooting': faStarShooting,
    lemon: faLemon,
  },
  fab: {
    patreon: faPatreon,
    hackerrank: faHackerrank,
  }
}
export default {
  name: 'BadgeStripe',
  functional: true,
  props: {
    value: {
      type: Object,
      required: true,
    }
  },
  render(h, { props }) {
    const iconPath = props.value.metadata?.fontawesome
    let icon = null
    if (iconPath) {
      const iconPack = icons[iconPath.pack]
      if (iconPack) {
        icon = iconPack[iconPath.icon]
      }
      if (!icon) {
        console.error(`${iconPath.pack}:${iconPath.icon} Not Found`)
      }
    }
    return (<div class="media">
      <div class="media-left">
        {icon && <font-awesome-icon icon={icon} size="3x" fixed-width/>}
      </div>
      <div class="media-content">
        <h4 class="title is-size-4">{props.value.title}</h4>
        <h6 class="subtitle is-size-6">{props.value.description}</h6>
      </div>
    </div>)
  }
}
