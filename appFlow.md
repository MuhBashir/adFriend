Here is the flow of the adFriend chrome extension:

```mermaid
flowchart TD
  A[User visits website]
  B[Content Script Executes]
  C[Scan for Ad Selectors]
  D{Ads Detected?}
  E["Do nothing (normal page)"]
  F[Replace Page with Widget]
  G["User interacts with Widget (inspiration, games, chat)"]
  H["Wait 1 Hour"]
  I["Rescan for Ads"]
  J{Ads Detected?}
  K[Replace Page with Widget]
  L["User interacts with Widget"]

  A --> B
  B --> C
  C --> D
  D -- No --> E
  D -- Yes --> F
  F --> G
  G --> H
  H --> I
  I --> J
  J -- Yes --> K
  J -- No --> E
  K --> L
  L --> H

```
