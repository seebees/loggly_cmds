(function() {
// simple if so I can expose to loggly, but still write tests
if ( typeof loggly === 'object'
         && loggly.bark 
         && loggly.bark.external_command) {
  // Expose to loggy
  loggly.bark.external_command({
    range: {
      help_url: "https://github.com/seebees/loggly_cmds"
      // Implementation
      // args is a " " delimited array of whatever was typed after the cmd
    , run: function run(args, stdin, context) {
            // do the work
            args = calculate(parseArgs(args)
                            , context.from
                            , context.until)

            // set the times
            if (args.from) {
              loggly
                .bark
                .commands
                .set
                .run(['from', args.from]
                   , stdin
                   , context)
            }

            if (args.until) {
              loggly
                .bark
                .commands
                .set
                .run(['until', args.until]
                   , stdin
                   , context)
            }
    }}
  })
}

var re_time      = /([01]?[0-9]|2[0-3]):([0-5][0-9]) ?(AM|PM)?/i
var re_relative  = /^(FROM|UNTIL)?([+-])(\d)+(SECOND|MINUTE|HOUR|DAY|MONTH|YEAR)S?$/i

// Top level helper
function calculate(args, currFrom, currUntil) {
  var ret = {}
  if (args.from) {
    var from = new Date(args.from)
    if (from.valueOf()) {
      ret.from = ISODateString(from)
    } else if (re_time.test(args.from)) {
      ret.from = timeOnly(args.from, currFrom)
    } else if (re_relative.test(args.from)) {

      console.log('how?')
      ret.from = relativeOnly(args.from
                            , currFrom
                            , currUntil
                            , '+')
    } else {
      // I don't know what you gave me,
      // but I'm going to let set work it out
      ret.from = args.from
    }
  }

  if (args.until) {
    var until = new Date(args.until)
    if (until.valueOf()) {
      ret.until = ISODateString(until)
    } else if (re_time.test(args.until)) {
      ret.until = timeOnly(args.until, currUntil)
    } else if (re_relative.test(args.until)) {
      ret.until = relativeOnly(args.until
                            , currFrom
                            , currUntil
                            , '-')
    } else {
      // I don't know what you gave me,
      // but I'm going to let set work it out
      ret.until = args.until
    }
  }
  return ret
}

// given only a time element update the dateString
function timeOnly(time, dateString) {
  // at this point it is not clear to me
  // if time arguments should be relative to today
  // or relative to the current from
  var date = new Date(dateString)
  var tmp = time.match(re_time)
  // AM vs Am vs am
  tmp[3] = tmp[3] ? tmp[3].toUpperCase() : ''
  // handle 1pm, but 13pm, I just assume you're confused
  if (tmp[1] < 13 && tmp[3] === 'PM') {
    tmp[1] += 12
  }

  // set
  if (tmp[1]) {
    date.setHours(tmp[1])
  }
  if (tmp[2]) {
    date.setMinutes(tmp[2])
  }

  return ISODateString(date)
}

// given a relative string, return a date
// e.g +12MINUTES | FROM-1DAY
// There are many arbitrary things happening here
function relativeOnly(str, currFrom, currUntil, op) {
  // relative time

  op = op || '+'
  var tmp = str.match(re_relative)

  tmp[1] = tmp[1] ? tmp[1].toUpperCase()
                  // I am optomizieng to get smaller time ranges
                  // This means that the default will be to move
                  // the times closer.  So, if I am updateing
                  // from, then + would default to FROM+ and
                  // - to UNTIL- becuase make the range smaller.
                  // Clearly updateing an until value is the oposit
                  : tmp[2] === op ? 'FROM' : 'UNTIL'

  var date = tmp[1] === 'UNTIL' ? new Date(currUntil)
                                : new Date(currFrom)

  tmp[3] = tmp[2] === '+' ? parseInt(tmp[3], 10)
                          : (parseInt(tmp[3], 10) * -1)

  return ISODateString(addToDate(date, tmp[3], tmp[4]))
}

function addToDate(date, value, type) {

  date = date || new Date()

  if (!value) return date

  switch(type.toUpperCase()) {
    case 'SECOND':
      date.setSeconds(date.getSeconds() + value)
      return date
    case 'MINUTE':
      date.setMinutes(date.getMinutes() + value)
      return date
    case 'HOUR':
      date.setHours(date.getHours() + value)
      return date
    case 'DAY':
      date.setDate(date.getDate() + value)
      return date
    case 'MONTH':
      date.setMonth(date.getMonth() + value)
      return date
    case 'YEAR':
      date.setYear(date.getFullYear() + value)
      return date

  }
}

// simple date/time 3/24/12 6:30 PM
// just date 3/24/12
// just time 4:30
// relative times +12MINUTES


function parseArgs(args) {
  // need to redo the tokens
  var tmp = args.join(' ')

  // This order makes from > until the default
  // and `range value` will colapse and just set from
  if (tmp.indexOf('<') > -1) {
    // from to until
    tmp = tmp.split('<')
    return {from  : tmp[1].trim()
          , until : tmp[0].trim()}
  } else {
    // until to from
    tmp = tmp.split('>')
    tmp[1] = tmp[1] || '' // lazy
    return {from  : tmp[0].trim()
          , until : tmp[1].trim()}
  }
}

function ISODateString(d) {
    function pad(n){
        return n < 10 ? '0'+n : n
    }
    return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())+'Z'
}

// hack so I can write my tests in node
if (typeof module === 'object' 
        && module.exports) {
  module.exports = {
    parseArgs     : parseArgs
  , calculate     : calculate
  , addToDate     : addToDate
  , relativeOnly  : relativeOnly
  , timeOnly      : timeOnly
  }
}

}())
