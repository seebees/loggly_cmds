var cmds  = require('../')

var test  = require('tap').test

// parse args
test('test parseArgs basic', function(t) {
  ret = cmds.parseArgs(['01/01/12', '>', '01/05/12'])

  t.deepEqual([['01/01/12', 'from']
              , ['01/05/12', 'until']]
            , ret)
  t.end()
})

test('test parseArgs basic reverse', function(t) {
  ret = cmds.parseArgs(['01/05/12', '<', '01/01/12'])

  t.deepEqual([['01/05/12', 'until']
              , ['01/01/12', 'from']]
            , ret)
  t.end()
})

test('test parseArgs only from', function(t) {
  ret = cmds.parseArgs(['01/01/12'])

  t.deepEqual([['01/01/12', 'from']]
            , ret)
  t.end()
})

test('test parseArgs only until', function(t) {
  ret = cmds.parseArgs(['01/05/12', '<'])

  t.deepEqual([['01/05/12', 'until']]
            , ret)
  t.end()
})

test('test parseArgs only from with >', function(t) {
  ret = cmds.parseArgs(['01/01/12', '>'])

  t.deepEqual([['01/01/12', 'from']]
            , ret)
  t.end()
})

// addToDate
test('test addToDate second', function(t) {
  var date = new Date('2012-01-01 9:00:00Z')

  ret = cmds.addToDate(date, 10, 'second')

  t.equal(new Date('2012-01-01 9:00:10Z').valueOf()
        , ret.valueOf())
  t.end()
})

test('test addToDate minute', function(t) {
  var date = new Date('2012-01-01 9:00:00Z')

  ret = cmds.addToDate(date, 10, 'minute')

  t.equal(new Date('2012-01-01 9:10:00Z').valueOf()
        , ret.valueOf())
  t.end()
})

test('test addToDate hour', function(t) {
  var date = new Date('2012-01-01 9:00:00Z')

  ret = cmds.addToDate(date, 1, 'hour')

  t.equal(new Date('2012-01-01 10:00:00Z').valueOf()
        , ret.valueOf())
  t.end()
})

test('test addToDate day', function(t) {
  var date = new Date('2012-01-01 9:00:00Z')

  ret = cmds.addToDate(date, 10, 'day')

  t.equal(new Date('2012-01-11 9:00:00Z').valueOf()
        , ret.valueOf())
  t.end()
})

test('test addToDate month', function(t) {
  var date = new Date('2012-01-01 9:00:00Z')

  ret = cmds.addToDate(date, 10, 'month')

  // Daylight saveings
  t.equal(new Date('2012-11-01 8:00:00Z').valueOf()
        , ret.valueOf())
  t.end()
})

test('test addToDate year', function(t) {
  var date = new Date('2012-01-01 9:00:00Z')

  ret = cmds.addToDate(date, 1, 'year')

  t.equal(new Date('2013-01-01 9:00:00Z').valueOf()
        , ret.valueOf())
  t.end()
})

// timeOnly
test('test timeOnly', function(t) {
  ret = cmds.timeOnly('4:30'
                    , new Date('2012-01-01 9:00:00Z'))

  t.equal('2012-01-01T12:30:00Z'
        , ret)
  t.end()
})

test('test timeOnly with PM', function(t) {
  ret = cmds.timeOnly('4:30 pm'
                    , new Date('2012-01-01 9:00:00Z'))

  t.equal('2012-01-02T00:30:00Z'
        , ret)
  t.end()
})

test('test timeOnly with 24Hour', function(t) {
  ret = cmds.timeOnly('14:30'
                    , new Date('2012-01-01 9:00:00Z'))

  t.equal('2012-01-01T22:30:00Z'
        , ret)
  t.end()
})

test('test timeOnly with irational PM', function(t) {
  ret = cmds.timeOnly('14:30 pm'
                    , new Date('2012-01-01 9:00:00Z'))

  t.equal('2012-01-01T22:30:00Z'
        , ret)
  t.end()
})

test('test timeOnly with only hour', function(t) {
  ret = cmds.timeOnly('2'
                    , new Date('2012-01-01 9:30:00Z'))

  t.equal('2012-01-01T10:00:00Z'
        , ret)
  t.end()
})

test('test timeOnly with hour and PM', function(t) {
  ret = cmds.timeOnly('2pm'
                    , new Date('2012-01-01 9:30:00Z'))

  t.equal('2012-01-01T22:00:00Z'
        , ret)
  t.end()
})

// relativeOnly

test('test relativeOnly FROM+20MINUTES', function(t) {
  ret = cmds.relativeOnly('FROM+20MINUTES'
                    , new Date('2012-01-01 9:30:00Z')
                    , new Date('2012-01-01 10:30:00Z'))

  t.equal('2012-01-01T09:50:00Z'
        , ret)
  t.end()
})

test('test relativeOnly UNTIL-20MINUTES', function(t) {
  ret = cmds.relativeOnly('UNTIL-20MINUTES'
                    , new Date('2012-01-01 9:30:00Z')
                    , new Date('2012-01-01 10:30:00Z'))

  t.equal('2012-01-01T10:10:00Z'
        , ret)
  t.end()
})

test('test relativeOnly -20MINUTES', function(t) {
  ret = cmds.relativeOnly('-20MINUTES'
                    , new Date('2012-01-01 9:30:00Z')
                    , new Date('2012-01-01 10:30:00Z'))

  t.equal('2012-01-01T10:10:00Z'
        , ret)
  t.end()
})

test('test relativeOnly +20MINUTES', function(t) {
  ret = cmds.relativeOnly('+20MINUTES'
                    , new Date('2012-01-01 9:30:00Z')
                    , new Date('2012-01-01 10:30:00Z'))

  t.equal('2012-01-01T09:50:00Z'
        , ret)
  t.end()
})

// calculate
test('test calculate with now', function(t) {

  ret = cmds.calculate('NOW-1HOUR'
                    , 'from'
                    , new Date('2012-01-01 9:30:00Z')
                    , new Date('2012-01-01 10:30:00Z'))

  t.equal('NOW-1HOUR', ret)
  t.end()
})

test('test calculate from with date only', function(t) {

  ret = cmds.calculate('3/14/12'
                    , 'from'
                    , new Date('2012-01-01 9:30:00Z')
                    , new Date('2012-01-01 10:30:00Z'))

  t.equal('2012-03-14T07:00:00Z'
        , ret)
  t.end()
})

test('test calculate until with date only', function(t) {

  ret = cmds.calculate('3/14/12'
                    , 'until'
                    , new Date('2012-01-01 9:30:00Z')
                    , new Date('2012-01-01 10:30:00Z'))

  t.equal('2012-03-15T06:59:59Z'
        , ret)
  t.end()
})

test('test calculate until relative to from', function(t) {

  ret = cmds.calculate('FROM+10MINUTES'
                    , 'until'
                    , new Date('2012-01-01 9:30:00Z')
                    , new Date('2012-01-01 10:30:00Z'))

  t.equal('2012-01-01T09:40:00Z'
        , ret)
  t.end()
})
