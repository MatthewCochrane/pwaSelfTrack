var arr = {
  max (array) {
    return Math.max.apply(null, array)
  },

  min (array) {
    return Math.min.apply(null, array)
  },

  cnt (array) {
    return array.length
  },

  range (array) {
    return arr.max(array) - arr.min(array)
  },

  midrange (array) {
    return arr.range(array) / 2
  },

  sum (array) {
    var num = 0
    for (var i = 0, l = array.length; i < l; i++) num += array[i]
    return num
  },

  mean (array) {
    return arr.sum(array) / array.length
  },

  median (array) {
    array.sort((a, b) => {
      return a - b
    })
    var mid = array.length / 2
    return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2
  },

  modes (array) {
    if (!array.length) return []
    var modeMap = {}
    var maxCount = 0
    var modes = []

    array.forEach(val => {
      if (!modeMap[val]) modeMap[val] = 1
      else modeMap[val]++

      if (modeMap[val] > maxCount) {
        modes = [val]
        maxCount = modeMap[val]
      } else if (modeMap[val] === maxCount) {
        modes.push(val)
        maxCount = modeMap[val]
      }
    })
    return modes
  },

  variance (array) {
    var mean = arr.mean(array)
    return arr.mean(array.map(num => {
      return Math.pow(num - mean, 2)
    }))
  },

  standardDeviation (array) {
    return Math.sqrt(arr.variance(array))
  },

  meanAbsoluteDeviation (array) {
    var mean = arr.mean(array)
    return arr.mean(array.map(num => {
      return Math.abs(num - mean)
    }))
  },

  zScores (array) {
    var mean = arr.mean(array)
    var standardDeviation = arr.standardDeviation(array)
    return array.map(num => {
      return (num - mean) / standardDeviation
    })
  }
}

// Function aliases:
arr.average = arr.mean

export default arr
