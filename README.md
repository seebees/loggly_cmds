Place to put helpfull loggly custom comands
-------------

Getting Started
==============

Install:

    load https://raw.github.com/seebees/loggly_cmds/master/index.js

The Basics
=========

The purpose is to make setting date ranges easy
    range fromValue > untilValue

But I did not want to force us to use 8601, so `range 3/10/12 > 3/11/12` works fine.
Anything that will parse in js `new Date()` is valid.
In addition you can specify the range backwards `range 3/11/12 < 3/10/12`

I try to do the right things with relative and partial time values as well.

Additional Features
==========

Given a date with no time, from values floor to 00:00:00 and 
until values celing to 11:59:59
    range 3/11/12 > 3/11/12 

Given a time with no date I will use the date for the given element
If `from = '2012-01-01T9:30:00Z'` then `range 10:30`
should set `from = '2012-01-01T10:30:00Z'`

Don't think to hard about the time zones, hopefully they work out.
If not let me know and try and fix it.

FROM+ and UNTIL+ are valid values.  So `range FROM-10MINUTES` will
move your from time back 10 minutes.

If you leave off the FROM|UNTIL like `range -10MINUTES`
Then I am optomized to shorten the range.  So in the above example
I would set the from time to 10 minutes before the until time.
Similarly `range +10MINUTES` would move the from time forward
10 minutes.  The until option works exatly the same way.

Maybe all that is a little long winded.  Try it like this,
sugar on the left, non-sugar on the right

    range -10MINUTES         range UNTIL-10MINUTES
    range +10MINUTES         range FROM+10MINUTES
    range -10MINUTES <       range UNTIL-10MINUTES
    range +10MINUTES <       range FROM+10MINUTES

I don't know if this is the perfect way.  Maybe it would be 
better to follow the operator?  Let me know

Examples
========

    range 4:30 > +10MINUTES
    range FROM-20MINUTES
