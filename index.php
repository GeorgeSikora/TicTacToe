<html>
<head>

    <meta name="viewport" content= "width=device-width, user-scalable=no">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="style/main.css">
    <link rel="stylesheet" href="style/time.css">
    <link rel="stylesheet" href="style/message.css">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js"></script>

    <script src="main.js"></script>
    <script src="timer.js"></script>
    <script src="field.js"></script>
    <script src="cell.js"></script>
    <script src="functions.js"></script>
    <script src="keyMouse.js"></script>
    <script src="bot.js"></script>

</head>
<body>
    <!-- TOP CONTENT -->
    <p id="time" class="time"></p>
    <div class="timeout">
        <p id="timeout">timeout: <span id="timeout-value"></span>s</p>
    </div>

    <!-- BOTTOM CONTENT -->
    <div id="bottom" class="bottom">
        <p id="message" class="message"></p>
    </div>

</body>
</html>