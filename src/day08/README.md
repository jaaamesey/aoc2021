# 🎄 Advent of Code 2021 - day 8 🎄

## Info

Task description: [link](https://adventofcode.com/2021/day/8)

## Notes

acedgfb: 8
cdfbe: 5
gcdfa: 2
fbcad: 3
dab: 7
cefabd: 9
cdfgeb: 6
eafb: 4
cagedb: 0
ab: 1

if 1 is ab
if 4 is eafb, then 9 must be ?efab?
                                  ^ d: first value of 7
                             ^ c: second value of 8



acedgfb: 8
cefabd: 9

a0 c1 e2 d3 g4 f5 b6

    // Derive new patterns for numbers
    knownValues[0] = knownValues[8][1] + knownValues[8][0] + knownValues[8][4] + knownValues[8][2] + knownValues[8][3] + knownValues[8][6]
    knownValues[2] = knownValues[8][4] + knownValues[8][1] + knownValues[8][3] + knownValues[8][5] + knownValues[8][0]
    knownValues[3] = knownValues[8][5] + knownValues[8][6] + knownValues[8][1] + knownValues[8][0] + knownValues[8][3] 
    knownValues[5] = knownValues[8][1] + knownValues[8][3] + knownValues[8][5] + knownValues[8][6] + knownValues[8][2]
    knownValues[6] = knownValues[8][1] + knownValues[8][3] + knownValues[8][5] + knownValues[8][4] + knownValues[8][2] + knownValues[8][6]
    knownValues[9] = knownValues[8][1] + knownValues[8][2] + knownValues[8][5] + knownValues[8][0] + knownValues[8][6] + knownValues[8][3]
    




