
export default {
  _TRACK_ICONS: {
    'number': 'filter_3',
    'text': 'text_fields',
    'yes-no': 'check_circle',
    'multiple-choice': 'poll',
    'duration': 'timelapse',
    'point-in-time': 'access_time',
    'custom': 'cake'
  },
  getIconCode (trackType) {
    return this._TRACK_ICONS[trackType]
  }
}
