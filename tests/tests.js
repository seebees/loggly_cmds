var cmds  = require('../')

var test  = require('tap').test

test('test parseArgs basic', function(t) {
  ret = cmds.parseArgs(['01/01/12', '>', '01/05/12'])

  t.ok(ret)
  t.ok(ret.from)
  t.ok(ret.until)

  t.equal('01/01/12', ret.from)
  t.equal('01/05/12', ret.until)
  t.end()
})

test('test parseArgs basic reverse', function(t) {
  ret = cmds.parseArgs(['01/05/12', '<', '01/01/12'])

  t.ok(ret)
  t.ok(ret.from)
  t.ok(ret.until)

  t.equal('01/01/12', ret.from)
  t.equal('01/05/12', ret.until)
  t.end()
})

test('test parseArgs only from', function(t) {
  ret = cmds.parseArgs(['01/01/12'])

  t.ok(ret)
  t.ok(ret.from)
  t.ok(!ret.until)

  t.equal('01/01/12', ret.from)
  t.end()
})

test('test parseArgs only until', function(t) {
  ret = cmds.parseArgs(['01/05/12', '<'])

  t.ok(ret)
  t.ok(!ret.from)
  t.ok(ret.until)

  t.equal('01/05/12', ret.until)
  t.end()
})

test('test parseArgs only from with >', function(t) {
  ret = cmds.parseArgs(['01/01/12', '>'])

  t.ok(ret)
  t.ok(ret.from)
  t.ok(!ret.until)

  t.equal('01/01/12', ret.from)
  t.end()
})

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

/*
test('test timeOnly', function(t) {

  ret = cmds.timeOnly(date, 1, 'year')

  t.equal(new Date('2013-01-01 9:00:00Z').valueOf()
        , ret.valueOf())
  t.end()
})
*/

test('test calculate with now', function(t) {

  ret = cmds.calculate({  from:'NOW-1HOUR'
                        , until:'NOW'}
                      , ''
                      , '')

  t.ok(ret)
  t.ok(ret.from)
  t.ok(ret.until)

  t.equal('NOW-1HOUR', ret.from)
  t.equal('NOW', ret.until)
  t.end()
})


