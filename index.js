(function() {
// simple if so I can expose to loggly, but still write tests in node
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
            $.each( parseArgs(args)
                  , function work(i, args) {
                      var value     = args[0]
                        , type      = args[1]
                        , currFrom  = logglyTimeToDate(context.from)
                        , currUntil = logglyTimeToDate(context.until)

                      if (value) {
                        loggly
                          .bark
                          .commands
                          .set
                          .run([ type
                               , calculate(value
                                          , type
                                          , currFrom
                                          , currUntil)]
                             , stdin
                             , context)
                      }
                  })

    }}
  })
  
  function logglyTimeToDate(time) {
    if (_LU.is_valid_relative_time(time)) {
      time = time.replace(/now/i, ISODateString(new Date()))
    }

    if (_LU.is_valid_zrel_time(time)) {
      time = _LU.zrel_to_datestring(time)
    }

    time = time.replace('T', ' ')

    if (_LU._is_valid_time(time, _LU.re_iso8601z)) {
      return new Date(time)
    }
  }
}

var re_time      = /^([01]?[0-9]|2[0-3]):?([0-5][0-9])? ?(AM|PM)?$/i
var re_time_part = /([01]?[0-9]|2[0-3]):?([0-5][0-9])? ?(AM|PM)?/i
var re_relative  = /^(FROM|UNTIL)?([+-])(\d+)(SECOND|MINUTE|HOUR|DAY|MONTH|YEAR)S?$/i

// top level helper
function calculate(value, type , currFrom, currUntil) {
  var ret = {}
  if (value) {
    var date = new Date(value)
    if (date.valueOf()) {
      if (type === 'until' && re_time_part.test(value)) {
        date.setSeconds(86399)
      }
      return ISODateString(date)
    } else if (re_time.test(value)) {
      return timeOnly(value
                    , type === 'from' ? currFrom
                                      : currUntil)
    } else if (re_relative.test(value)) {
      return relativeOnly(value
                        , currFrom
                        , currUntil)
    } else {
      // I don't know what you gave me,
      // but I'm going to let set work it out
      return value
    }
  }
}

// given only a time element update the dateString
function timeOnly(time, date) {
  // or relative to the current from
  var tmp = time.match(re_time)
  // AM vs Am vs am
  tmp[3] = tmp[3] ? tmp[3].toUpperCase() : ''
  // handle 1pm, but 13pm, I just assume you're confused
  if (tmp[1] < 13 && tmp[3] === 'PM') {
    tmp[1] = parseInt(tmp[1], 10) + 12
  }

  // set
  if (tmp[1]) {
    date.setHours(tmp[1])
  }
  if (tmp[2]) {
    date.setMinutes(tmp[2])
  } else {
    // only an hour was passed
    date.setMinutes(0)
  }

  return ISODateString(date)
}

// given a relative string, return a date
// e.g +12MINUTES | FROM-1DAY
// There are many arbitrary things happening here
function relativeOnly(str, currFrom, currUntil) {
  // relative time

  var tmp = str.match(re_relative)

  tmp[1] = tmp[1] ? tmp[1].toUpperCase()
                  // I am optomizieng to get smaller time ranges
                  // This means that the default will be to move
                  // the times closer.  So, if I am updateing
                  // from, then + would default to FROM+ and
                  // - to UNTIL- becuase make the range smaller.
                  // Clearly updateing an until value is the oposit
                  : tmp[2] === '+' ? 'FROM' : 'UNTIL'

  var date = tmp[1] === 'UNTIL' ? currUntil
                                : currFrom

  tmp[3] = tmp[2] === '+' ? parseInt(tmp[3], 10)
                          : (parseInt(tmp[3], 10) * -1)

  return ISODateString(addToDate(date, tmp[3], tmp[4]))
}

// what it says on the can, take a date, add some value
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

// loggly will pass me an array split on ' '
// but I want an array split on <|>
function parseArgs(args) {
  // need to redo the tokens
  var values  = args.join(' ')
    , order   = ['from', 'until']

  // This order makes from > until the default
  // and `range value` will colapse and just set from
  if (values.indexOf('<') > -1) {
    // from to until
    values = values.split('<')
    order = ['until', 'from']
  } else {
    // until to from
    values = values.split('>')
  }

  var ret = []
  // not all browsers have Array.map *sadness*
  for (var i=0; i<values.length; i++) {
    if (values[i].trim()) {
      ret[i] = [values[i].trim(), order[i]]
    }
  }

  return ret
}

// 8601 string from a date
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
