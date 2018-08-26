# catav

## Overview

calculate categorized stats( sum, averate, variant, stddev, and count ) from input data.

## How to use

- POST /catstats

    - You can post 2 different types of data:

        1

            - inputs : [ { value:1.0, category:'A' }, { value:2.0, category:'A' }, { value:3.0, category:'B' }, .., { value:10.0, category: 'C' } ]

        2

            - values: [ 1.0, 2.0, 3.0, .., 10.0 ]

            - categories: [ 'A', 'A', 'B', .., 'C' ]
        
## Copyright

2018 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.

