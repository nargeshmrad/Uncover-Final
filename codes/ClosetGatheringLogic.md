## **Clothing Sprites & Their Interactions:**

### **1. SHIRT Sprite**
**Dragging Behavior:**
- When mouse hovers over shirt → becomes draggable
- When dragging starts → image changes from `ShirtHangedImg` to `shirtBodyImg`
- Plays `clothesSound` when dragging begins

**Drop Zone Logic:**
- **Target:** `shirtWearZone` (position: x=748, y=281)
- **Drop condition:** Within 50 pixels of wear zone
- **Success:** 
  - Snaps to wear zone position
  - Keeps `shirtBodyImg` 
  - Sets `topWornItem = 'shirt'` and `isShirtWorn = true`
  - Plays `clothesDropSound`
  - Shows dialog: *"If I wear this, no one's gonna say anything — and I still kind of feel like myself"*
  - Dialog disappears after 5 seconds
- **Failure:** Returns to original position (318, 218) with `ShirtHangedImg`

**Conflict Resolution:** If shirt is successfully worn, removes any other top category items (top clothing or overall)

---

### **2. LONG PANTS Sprite**
**Dragging Behavior:**
- When dragging starts → image changes from `foldedLongPantImg` to `longPantImg` (unfolded)
- Plays `clothesSound` (looped)
- **Magnetic effect:** When within 100 pixels of wear zone, gets pulled toward it

**Drop Zone Logic:**
- **Target:** `dropZone` (position: x=747, y=411)
- **Drop condition:** Overlaps with dropZone OR within 100 pixels
- **Success:**
  - Snaps to wear zone
  - Keeps `longPantImg` (unfolded)
  - Sets `bottomWornItem = 'longPants'` and `isPantInDropZone = true`
  - Plays `clothesDropSound`
  - Shows dialog: *"It's kinda hot, but at least no one's gonna comment on my legs or anything."*
  - Dialog disappears after 5 seconds
- **Failure:** Returns to `foldedDropZone` with `foldedLongPantImg`

**Conflict Resolution:** Removes any other bottom category items (short pants or overall)

---

### **3. SOCKS Sprite**
**Dragging Behavior:**
- When dragging starts → image changes from `SocksClosetImg` to `socksSelectedImg`
- Plays `clothesSound` (looped)
- Only draggable when `!isSocksWorn`

**Drop Zone Logic:**
- **Target:** `socksWearZone` (position: x=747, y=517)
- **Drop condition:** Within 35 pixels of wear zone
- **Success:**
  - Snaps to wear zone (with -13 y offset)
  - Image changes to `socksInFeetImg`
  - Sets `isSocksWorn = true`
  - Plays `clothesDropSound`
  - **No dialog box for socks**
- **Failure:** Returns to original position (319, 480) with `SocksClosetImg`

---

### **4. OVERALL Sprite**
**Dragging Behavior:**
- When dragging starts → image changes from `OverallInClosetImg` to `OverallSelectedImg`
- Plays `clothesSound`

**Drop Zone Logic:**
- **Target:** `overallWearZone` (position: x=748, y=307)
- **Drop condition:** Within 50 pixels of wear zone
- **Success:**
  - Snaps to wear zone
  - Keeps `OverallSelectedImg`
  - Sets BOTH `topWornItem = 'overall'` AND `bottomWornItem = 'overall'`
  - Plays `clothesDropSound`
  - Shows dialog: *"Last time I wore something this short, I didn't even make it to the door. Dad told me I'd get picked up by the police."*
  - Dialog disappears after 5 seconds
- **Failure:** Returns to original position (497, 247) with `OverallInClosetImg`

**Conflict Resolution:** Removes ANY other clothing items from BOTH top and bottom categories

---

### **5. SHORT PANTS Sprite**
**Dragging Behavior:**
- When dragging starts → image changes from `foldedShortPantImg` to `shortPantOnBodyImg`
- Plays `clothesSound`

**Drop Zone Logic:**
- **Target:** `shortPantsWearZone` (position: x=749, y=359)
- **Drop condition:** Within 50 pixels of wear zone
- **Success:**
  - Snaps to wear zone
  - Keeps `shortPantOnBodyImg`
  - Sets `bottomWornItem = 'shortPants'`
  - Plays `clothesDropSound`
  - Shows dialog: *"It's boiling out. I want to wear these so bad — but I can't in the street. One day they don't care, the next day they arrest you."*
  - Plays `shortPantSound` audio file
  - Dialog disappears when `shortPantSound` ends
- **Failure:** Returns to original position (505, 490) with `foldedShortPantImg`

**Conflict Resolution:** Removes any other bottom category items (long pants or overall)

---

### **6. SHOES Sprite**
**Dragging Behavior:**
- When dragging starts → plays `clothesSound`
- No image change during drag

**Drop Zone Logic:**
- **Target:** `shoesWearZone` (position: x=749, y=515)
- **Drop condition:** Within 50 pixels of wear zone
- **Success:**
  - Snaps to wear zone
  - Plays `clothesDropSound`
  - Shows dialog: *"It's funny — I can wear these now, no problem. But that other time at school, they sent me home just because my shoes were 'too attention-grabbing'."*
  - Plays `sneakersSound` audio file
  - Dialog disappears when `sneakersSound` ends
- **Failure:** Returns to original position (319, 560)

**No conflict resolution** - shoes don't conflict with other items

---

### **7. TOP CLOTHING Sprite**
**Dragging Behavior:**
- When dragging starts → image changes from `topHangedImg` to `TopOnBodyImg`
- Plays `clothesSound`

**Drop Zone Logic:**
- **Target:** `topWearZone` (position: x=748, y=265)
- **Drop condition:** Within 50 pixels of wear zone
- **Success:**
  - Snaps to wear zone
  - Keeps `TopOnBodyImg`
  - Sets `topWornItem = 'top'`
  - Plays `clothesDropSound`
  - Shows dialog: *"Getting arrested in the street, a comment at a family gathering, someone calling my parents, then a fight at home."*
  - Plays `cropTopSound` audio file
  - Dialog disappears when `cropTopSound` ends
- **Failure:** Returns to original position (372, 211) with `topHangedImg`

**Conflict Resolution:** Removes any other top category items (shirt or overall)

---

## **Sound System:**
- **Background:** `ClosetAmbience.mp3` loops continuously at 50% volume
- **Dragging:** `clothesMovement.mp3` plays when starting to drag any item
- **Dropping:** `clothesDrop.mp3` plays when successfully placing items
- **Special sounds:** `CropTop.m4a`, `ShortPant.m4a`, `Sneakers.m4a` for specific items
- All clothing sounds stop when items are released

## **Clothing Categories & Conflicts:**
- **Top Category:** Shirt, Top Clothing, Overall (only one can be worn)
- **Bottom Category:** Long Pants, Short Pants, Overall (only one can be worn)
- **Individual:** Socks and Shoes (no conflicts)
- **Overall is special:** Occupies BOTH top and bottom categories simultaneously

## **Additional Features:**
- **Debug display:** Shows real-time x,y coordinates of all sprites
- **Magnetic effect:** Long pants get pulled toward wear zone when within 100 pixels
- **Visual feedback:** Items change appearance when being dragged vs. worn vs. stored

 