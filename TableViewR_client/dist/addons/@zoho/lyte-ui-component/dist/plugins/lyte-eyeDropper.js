; (function () {
    if ($L) {
        $L.eyeDropper = {};
        // Called to enable the eyedropper
        $L.eyeDropper.initialize = function (obj) {
            if (window.EyeDropper == undefined) {
                // EyeDropper API is not supported on this platform
                lyteEyeDropper(obj);
            }
            else {
                eyeDropperApi(obj);
            }
        }

        /**
         * Uses the EyeDropper API to get the pixel colour
         * @param {object} obj Has the options to enable the eyedropper
         */
        function eyeDropperApi(obj) {
            var query = obj.query;
            // Create an EyeDropper object
            let eyeDropper = new EyeDropper();
            document.querySelector(query).addEventListener('click', e => {
                // Enter eyedropper mode
                eyeDropper.open()
                    .then(colorSelectionResult => {
                        // returns hex color value (#RRGGBB) of the selected pixel
                        console.log("The selected color is", colorSelectionResult.sRGBHex);
                        $L.eyeDropper.selectedColor = colorSelectionResult.sRGBHex;
                    })
                    .catch(error => {
                        console.error(error);
                    });
            });
        }

        /**
         * Add the eventListener to the queried object,
         * so that the eyedropper plugin can be enabled by clicking the object.
         * @param {object} obj
         */
        function lyteEyeDropper(obj) {
            var query = obj.query;
            document.querySelector(query).addEventListener('click', e => {
                openEyeDropper();
            });
        }

        /**
         * convert RGBA color to RGB color for better presentation of the capture image
         * @param {*} rgbaColor
         * @returns equivalent RGB color
         */
        function rgbaToRgb(rgbaColor) {

            // Parse the RGBA color string to extract the individual components
            var components = rgbaColor.match(/\d*\.?\d+/g);
            // Extract the alpha value and convert it to a number
            var alpha = parseFloat(components[3]);

            // Calculate the equivalent RGB color by blending with a white background
            var blendedRed = Math.round(components[0] * alpha + 255 * (1 - alpha));
            var blendedGreen = Math.round(components[1] * alpha + 255 * (1 - alpha));
            var blendedBlue = Math.round(components[2] * alpha + 255 * (1 - alpha));
            var rgb = 'rgb(' + blendedRed + ', ' + blendedGreen + ', ' + blendedBlue + ')';

            // Return the equivalent RGB color string
            return rgb;
        }

        /**
         * The image screengrab returns will not be having the background color
         * The background color is set using this function
         */
        function setBodyColor(dom) {
            var body = document.querySelector('body');
            var bodyColor = window.getComputedStyle(body).getPropertyValue('background-color');

            var rgbRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*\d*\.?\d+\s*)?\)$/i;
            // Check if the color string matches the RGB or RGBA format
            if (rgbRegex.test(bodyColor)) {
                if (bodyColor.indexOf('rgba') !== -1) {
                    bodyColor = rgbaToRgb(bodyColor)
                }
            }
            /**
             * Since the image is placed over the DOM,
             * The image should be opaque and not transparent
             * So the body color should not be transparent as in RGBA
             * So the equivalent RGB color of RGBA is calculated and set as background color
             */
            dom.children[0].children[0].style.background = bodyColor;
            dom.children[0].style.background = bodyColor;
        }

        /**
         * Add the events to view enlarged image and select a color
         */
        function openEyeDropper() {
            var body = document.querySelector('body');
            var bodyColor = window.getComputedStyle(body).getPropertyValue('background-color');
            var options = { dom: "body", onBeforeConstruct: setBodyColor, background: bodyColor }

            // Screengrab takes a screenshot of the body element
            $L.screenGrab(options).then(function (result) {

                // Setting the image on top of the DOM
                var image = result.image;
                document.body.appendChild(image);
                $L.eyeDropper.isEyedropperActive = true;
                image.id = 'lyteEyeDropperImage';
                image.style.opacity = 1;
                // Image is appended on top of the document body
                document.body.appendChild(image);

                // Click event is added to select the color of the particular value
                image.addEventListener('click', function (event) {
                    getPixelInfo(event);
                });

                // MouseMove event is added to create an enlarged view of the circular area around the pixel
                image.addEventListener('mousemove', function (event) {
                    enlargePixel(event);
                })
                // Adding the required canvases
                createCanvas();
            })

            // Prevent scrolling on touch devices
            document.addEventListener('touchmove', preventScroll, { passive: false });
            // Prevent scrolling on desktop
            document.addEventListener('mousewheel', preventScroll, { passive: false });
        }

        // Function to prevent the default event
        function preventScroll(event) {
            event.preventDefault();
        }

        //Enlarged canvas and the mainCanvas to plot the cordinates are created and appended to the DOM
        function createCanvas() {

            // Canvas to print the whole body
            var mainCanvas = document.createElement('canvas');
            if (mainCanvas) {
                mainCanvas.style.top = 0;
                mainCanvas.style.left = 0;
                mainCanvas.style.display = 'none';
            }
            mainCanvas.id = 'lyteMainCanvas'
            document.body.appendChild(mainCanvas);

            // Get references to the image
            var image = document.getElementById('lyteEyeDropperImage');
            if (image) {
                image.style.top = 0;
                image.style.left = 0;
                image.style.position = 'absolute';
                image.style.zIndex = 1000;
            }

            // Making sure that the canvas and image are of same size.
            mainCanvas.width = image.width;
            mainCanvas.height = image.height;
            var mainCtx = mainCanvas.getContext('2d');
            // Draw the image onto the canvas
            mainCtx.drawImage(image, 0, 0, image.width, image.height);

            // Canvas to show the enlarged view of the pixel
            var enlargedViewCanvas = document.createElement('canvas');
            if (enlargedViewCanvas) {
                enlargedViewCanvas.style.borderRadius = '50%';
                enlargedViewCanvas.style.position = 'absolute';
                enlargedViewCanvas.style.zIndex = 1001;
            }
            enlargedViewCanvas.id = 'lyteEnlargedViewCanvas';
            enlargedViewCanvas.style.display = 'none';

            enlargedViewCanvas.width = 100;
            enlargedViewCanvas.height = 100;
            document.body.appendChild(enlargedViewCanvas);
        }

        /**
         * Calculate the hexValue of corresponding pixel color from the clicked point
         * @param {object} event the mouse event
         */
        function getPixelInfo(event) {
            // Get the Canvas having the screengrabbed image
            var mainCanvas = document.getElementById('lyteMainCanvas');
            var mainCtx = mainCanvas.getContext('2d');

            // Calculate the relative coordinates with the help of mouse click
            var cordinates = calculateCords(event);
            var mouseX = cordinates[0];
            var mouseY = cordinates[1];

            // Get the data of the pixel on which the mouse click event occured
            var pixel = mainCtx.getImageData(mouseX, mouseY, 1, 1).data;
            var colorRgb = 'rgb(' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ')';
            // Convert the value to hexadecimal value
            var color = rgbToHex(pixel[0], pixel[1], pixel[2]);

            console.log("The selected colour is", color, colorRgb);
            // remove the canvases and image overlay from DOM
            disable();
            $L.eyeDropper.isEyedropperActive = false;
            $L.eyeDropper.selectedColor = color;
        }
        // Create enlarged view of the pixel to which the mouse points to
        function enlargePixel(event) {
            // Get references to the canvas
            var mainCanvas = document.getElementById('lyteMainCanvas');
            var cordinates = calculateCords(event);
            var mouseX = cordinates[0];
            var mouseY = cordinates[1];

            // Get the canvas on which the enlarged view has to be shown
            var enlargedViewCanvas = document.getElementById('lyteEnlargedViewCanvas');
            var enlargedViewCtx = enlargedViewCanvas.getContext('2d');
            enlargedViewCanvas.style.display = 'block';
            // Clear previous content
            enlargedViewCtx.clearRect(0, 0, enlargedViewCanvas.width, enlargedViewCanvas.height);

            // Define the radius of the circular region
            // The smaller the radius the more zooming is
            var radius = 5;
            // Define the region of interest
            var roiWidth = 2 * radius;
            var roiHeight = 2 * radius;
            var roiX = mouseX - radius;
            var roiY = mouseY - radius;

            // Draw the enlarged view
            // A circular area of radius 5px is mapped to a canvas of 50px radius.
            // roiX, roiY defines the top left corner of the image to be copied
            // roiHeight and roiWidth will give the height and width of the required area
            enlargedViewCtx.drawImage(
                mainCanvas, // Source canvas
                roiX, roiY, roiWidth, roiHeight, // Source region (rectangle)
                0, 0, 100, 100 // Destination region (rectangle)
            );

            // Position the enlarged view canvas at the mouse pointer location
            // Adding an offset to prevent overlap with the mouse pointer
            enlargedViewCanvas.style.left = (mouseX) + 'px';
            enlargedViewCanvas.style.top = (mouseY) + 'px';
            enlargedViewCanvas.style.display = 'block';

            // adding a square at the center
            var squareSize = 7; // Adjust the size of the square as needed
            var squareTopLeftX = 50 - squareSize / 2; // 50 is the x-coordinate of the pixel
            var squareTopLeftY = 50 - squareSize / 2; // 50 is the y-coordinate of the pixel
            enlargedViewCtx.strokeStyle = '#878787'; // Set the stroke color
            enlargedViewCtx.lineWidth = 1; // Set the line width
            enlargedViewCtx.strokeRect(squareTopLeftX, squareTopLeftY, squareSize, squareSize); // Draw the square
        }

        // the X and Y coordinates are calculated with the help of event.clientX and event.clientY
        function calculateCords(event) {
            var mouseX = event.clientX;
            var mouseY = event.clientY;

            // The accurate x and y coordinates are calculated
            //the number of pixels that has been scrolled horizontally from the left side of the document.
            var leftSpace = document.documentElement.scrollLeft || document.body.scrollLeft;
            if (leftSpace) {
                mouseX = mouseX + leftSpace;
            }
            // the number of pixels that has been scrolled vertically from the top of the document
            var topSpace = parseFloat(document.documentElement.scrollTop || document.body.scrollTop);
            if (topSpace) {
                mouseY = mouseY + topSpace;
            }
            // return the accurate coordinates.
            var cords = [mouseX, mouseY];
            return cords;
        }

        // The rgb values are used to calculate the hexadecimal value
        function rgbToHex(r, g, b) {
            // Convert each component to hexadecimal and pad with zeros if necessary
            var red = r.toString(16).padStart(2, '0');
            var green = g.toString(16).padStart(2, '0');
            var blue = b.toString(16).padStart(2, '0');
            // Concatenate the components and return the hexadecimal color value
            return '#' + red + green + blue;
        }
        /**
         * Remove the plugin from DOM
         * Called after a colour is selected
         */
        function disable() {
            var image = document.getElementById('lyteEyeDropperImage');
            image.remove();
            // Remove scrolling preventers
            document.removeEventListener('touchmove', preventScroll, { passive: false });
            document.removeEventListener('mousewheel', preventScroll, { passive: false });
            // removeCanvases
            var mainCanvas = document.getElementById('lyteMainCanvas');
            mainCanvas.remove();
            var enlargedViewCanvas = document.getElementById('lyteEnlargedViewCanvas');
            enlargedViewCanvas.remove();
        }
    }
})();
// The eyedropper will open when clicked on the query object
// $L.eyeDropper.initialize({ 'query': '#lyteEyeDropperButton' })