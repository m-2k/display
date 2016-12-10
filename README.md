# Display
High-quality copy of display of Panasonic sound system.

# Dependencies

* [Paper.JS](https://github.com/paperjs/paper.js)

# Usage

* Set Canvas node for rendering display
* Set SVG-file location for loading
* Attach Audio node for analyse audio data

```javascript
window.onload = function() {
    var onLoad = function(e) { e.setText('    TAPE 1'); };
    var canvas = document.getElementById('canvas'); // HTML5 Canvas Node
    var dispLocation = '/display-sa-ak28.svg'; // Path to SVG file
    
    var disp = new Display();
    disp.init(canvas, dispLocation, onLoad);
    disp.attachStream(document.getElementById('audio')); // HTML5 Audio Node
};
   
```

# Licence
MIT Licence

# Authors
* [_m_2k](https://twitter.com/_m_2k)
