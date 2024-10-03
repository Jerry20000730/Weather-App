# ReactNative (mobile client) & Express (server)



## Goal

1. You will implement the main screen of the Weather App
- The main screen will have a search button at the top
    - This will actually be a Pressable component that will open a modal dialog (see below) when pressed
- The main screen will show the current weather selected in search
    - If no search has been selected, the screen should just show a message saying `Touch the search bar to enter a zip code`
    - Follow the fonts, colors and spacing in the Figma Design for the main screen
        - The main screen will show the current temperature, sunrise/sunset, wind speed, location, and 3 day forecast retrieved from the weather API
        - The main screen will also show either a button with an outline heart icon and Add to Favorites or a filled in heart icon (no button) if the location is already a favorite
            - (new) if Add to Favorites is pressed, the location will be added to the backend and the button will change to a filled in heart
        - You will implement a button to switch between Metric and Imperial units which should update the main screen appropriately
2. You will implement a modal dialog for searching zip codes and displaying favorites
    - The modal will cover the entire screen
    - At the top of the modal, there will be a search icon and a `TextInput` for entering a zip code
        - When a correctly formatted zip code is entered, your app will automatically call the weather API to retrieve the current weather for that location
            - While this is loading, you will show an ActivityIndicator
            - If the zip code is not valid, you should show a message such as "Location not found." in the search result area
    - You will also have a Cancel button beside the search input that will dismiss the modal. For cancel, whatever prior state was on the main screen will be displayed
    - Below the `TextInput`, you will show the current search results
        - The result should be Pressable and when pressed, the modal will be dismissed and the location will be loaded on the main screen
    - The current list of Favorites will be stored below the search results
        - Each favorite item will be `Pressable`. when pressed, that location will be loaded
            - an `ActivityIndicator` should display while it's loading
            - the modal will be dismissed and the favorite location will be displayed on the main screen
        - Each row will also have a Remove button. If pressed, the favorite will be deleted from the backend and the favorites list will be updated
