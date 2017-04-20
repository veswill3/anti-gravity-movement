A quickly thrown together playground to test different parameters for [anti-gravity based movement](http://robowiki.net/wiki/Anti-Gravity_Movement).

The red circle will follow your mouse around the field of obstacles and should 'slip' around them. At the bottom are various parameters to tweak for better or worse results. The large circle around the moving object is 'vision' - only obstacles inside it are considered for avoidance to save on computation. Click to create a new obstacle.

Basically, the moving object will try to move toward the mouse while each obstacle contributes an opposing push force. Since this is about avoiding obstacles and not about simulating gravitational objects, the math deviates significantly to include a few more options.

- **forceCoeff** is like mass and gravity together, representing the force.
- **distExp** is a distance buff - as you get closer to an object it pushes away harder.
- **distFalloffCoeff** is distance falloff coefficient.
- **distFalloffExp** is distance falloff exponent. Higher values means far away objects are essentially negligible.