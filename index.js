const MYANMAR_PHONE_REGEX = /^(09|\+?950?9|\+?95950?9)\d{7,9}$/
const COUNTRY_CODE_REGEX = /^\+?950?9\d+$/
const DOUBLE_COUNTRY_CODE_REGEX = /^\+?95950?9\d{7,9}$/
const ZERO_BEFORE_AREA_CODE_REGEX = /^\+?9509\d{7,9}$/

const OPERATORS = {
  OOREDOO: 'ooredoo',
  TELENOR: 'telenor',
  MPT: 'mpt',
  MYTEL: 'mytel',
  UNKNOWN: 'unknown'
}

const OPERATOR_REGEX = {
  OOREDOO: /^(09|\+?959)9(5|7|6)\d{7}$/,
  TELENOR: /^(09|\+?959)7(9|8|7)\d{7}$/,
  MYTEL: /^(09|\+?959)6\d{8}$/,
  MPT: /^(09|\+?959)(5\d{6}|4\d{7,8}|2\d{6,8}|3\d{7,8}|6\d{6}|8\d{6}|7\d{7}|9(0|1|9)\d{5,6}|2[0-4]\d{5}|5[0-6]\d{5}|8[13-7]\d{5}|3[0-369]\d{6}|34\d{7}|4[1379]\d{6}|73\d{6}|91\d{6}|25\d{7}|26[0-5]\d{6}|40[0-4]\d{6}|42\d{7}|45\d{7}|89[6789]\d{6}|)$/
}

const NETWORK_TYPE = {
  GSM: 'GSM',
  WCDMA: 'WCDMA',
  CDMA_450: 'CDMA 450 MHz',
  CDMA_800: 'CDMA 800 MHz',
  UNKNOWN: 'unknown'
}

const NETWORK_REGEX = {
  WCDMA: /^(09|\+?959)(55\d{5}|25[2-4]\d{6}|26\d{7}|4(4|5|6)\d{7})$/,
  CDMA_450: /^(09|\+?959)(8\d{6}|6\d{6}|49\d{6})$/,
  CDMA_800: /^(09|\+?959)(3\d{7}|73\d{6}|91\d{6})$/
}

const sanitize = (number) => {
  let pureNumber = number.trim().replace(/[- )(]/g,'')

  if (COUNTRY_CODE_REGEX.test(pureNumber)) {
    if (DOUBLE_COUNTRY_CODE_REGEX.test(pureNumber)) {
      pureNumber = pureNumber.replace(/9595/, '95')
    }
    if (ZERO_BEFORE_AREA_CODE_REGEX.test(pureNumber)) {
      pureNumber = pureNumber.replace(/9509/, '959')
    }
  }
  return pureNumber
}

const validate = (number) => {
  number = sanitize(number)
  return MYANMAR_PHONE_REGEX.test(number)
}

const getOperatorName = (number) => {
  number = sanitize(number)
  if(number) {
    switch (true) {
      case OPERATOR_REGEX.OOREDOO.test(number):
        return OPERATORS.OOREDOO
      case OPERATOR_REGEX.TELENOR.test(number):
        return OPERATORS.TELENOR
      case OPERATOR_REGEX.MPT.test(number):
        return OPERATORS.MPT
      case OPERATOR_REGEX.MYTEL.test(number):
        return OPERATORS.MYTEL
      default:
        return OPERATORS.UNKNOWN
    }
  }
  return OPERATORS.UNKNOWN
}

const getNetworkType = (number) => {
  number = sanitize(number)
  if(number && validate(number)) {
    const operator = getOperatorName(number)
    if(operator === OPERATORS.OOREDOO || operator === OPERATORS.TELENOR || operator === OPERATORS.MYTEL) {
      return NETWORK_TYPE.GSM
    }
    switch (true) {
      case NETWORK_REGEX.WCDMA.test(number):
        return NETWORK_TYPE.WCDMA
        case NETWORK_REGEX.CDMA_450.test(number):
        return NETWORK_TYPE.CDMA_450
        case NETWORK_REGEX.CDMA_800.test(number):
        return NETWORK_TYPE.CDMA_800
      default:
        return OPERATORS.UNKNOWN
    }
  }
  return OPERATORS.UNKNOWN
}

export {
  sanitize,
  validate,
  getOperatorName,
  getNetworkType
}
