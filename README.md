most-web-md
===========

MOST Web Framework Markdown View Engine

A markdown view engine as a middleware in web applications based on MOST Web Framework

##Install

$ npm install most-web-md

##Usage

Register view engine by adding the following node in config/app.json engines collection:

    "engines": [
        ...
        {
            "name": "Markdown View Engine",
            "extension": "md",
            "type": "most-web-md"
        }
        ...
    ]
}
