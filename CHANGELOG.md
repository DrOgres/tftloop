# Changelog

## [4.0.1] - 2026-04-21

### Changed

- Replaced TinyMCE with ProseMirror as the Actor Notes editor
- Moved the CHANGELOG out of the README

### Fixed

- FoundryVTT's native dialogs being improperly styled
- Minor Actor sheet inconsistencies
- Deprecated usage of global `mergeObject`

### Removed

- Kid Type editor from System Settings pending a fuller treatment of the feature

## [4.0.0] - 2025-06-17

- V13 Compatibility
- Update de.json by @Tarubain in #58
- fixing deprecated gridUnit and gridDistance by @GwennKoi in #57

## [3.0.2] - 2025-03-02

- Create cn.json by @ChenQTYF in #56

## [3.0.1] - 2024-07-21

- fixed 3D Dice not rolling [#54](https://github.com/DrOgres/tftloop/issues/54) Thanks to @Bithir for the assist!
- fixed XP tracker not working [#53](https://github.com/DrOgres/tftloop/issues/53) Thanks to @Bithir for the assist!

## [3.0.0] - 2024-05-29

- Version 12 compatibility [#51](https://github.com/DrOgres/tftloop/issues/51)
- Fixed deletion of items when dropped on originating character sheet [#52](https://github.com/DrOgres/tftloop/issues/52)

## [2.1.4] - 2024-02-28

- Fix: [#50](https://github.com/DrOgres/tftloop/issues/50) Dropped items on a character sheet was creating two items rather than one.
- Improved drag and drop of items from character to character by removing the item from the source character.

## [2.1.3] - 2024-02-03

- Token default settings updated [#49](https://github.com/DrOgres/tftloop/issues/49)
- super minor css changes for tabs on UI elements

## [2.1.2] - 2024-01-28

- Localization updates

## [2.1.1] - 2023-05-28

- Update to Foundry v11 compatability

## [2.0.10] - 2023-05-24

- Fix relationship type field and iconic item bonus display on teen sheet this closes issue #44

## [2.0.9] - 2023-05-14

- Fix DSN! not respecting roll mode this closes issue #43

## [2.0.8] - 2023-04-20

- Fix consition calculation this closes issue #42

## [2.0.7] - 2023-04-08

- Fix rolls for negative totals that add bonus dice. this closes issue #41

## [2.0.6] - 2023-03-12

- Defined initiative roll to fix issue with combat tracker this closes issue #40

## [2.0.5] - 2023-02-22

- Fixed bug: Roll Mode not being set properly on item rolls. This closes issue #39

## [2.0.4] - 2023-02-22

- Added drag and drop macro creation for tests on skills and attributes. This closes issue #31
- 
## [2.0.3] - 2023-01-18

- Actor duplication bug fix. This closes issue #37

## [2.0.2] - 2022-10-22

- Css fix for unreadable journal sidebar also covers changes to v10 journals in general.

## [2.0.1] - 2022-09-04

- Founudry V10 System ready

## [2.0.0] - 2022-09-04

- Foundry V10 compatibility update

## [1.2.7] - 2021-11-03

- Updated Japanese localization

## [1.2.4] - 2021-10-29

- Added Polish Localization thanks to arturkonczalski! || Dodano polską lokalizację dzięki arturkonczalskiemu!

## [1.2.3] - 2021-10-24

- FIXED Relationship nature field not keeping edits!

## [1.2.2] - 2021-10-24

- FIXED dice roll - async behavior not showing sucesses!

## [1.2.1] - 2021-10-24

- reversiond to fix offical content version check bug

## [1.0.10] - 2021-10-23

- v9 224 compatability fix - tab not showing

## [1.0.9] - 2021-10-19

- (BUGFIX) Hideout Notes not saving properly

## [1.0.8] - 2021-10-06

- Changed sheet layout to move notes to new tab

## [1.0.7] - 2021-08-08

- Code base brought up to match Foundry v9.220 (v9 prototype 1)

## [1.0.6] - 2021-08-06

- Brought version up to required version for core Module Compatability

## [1.0.5] - 2021-07-24

- (bugfix) Iconic item not showing

## [1.0.4]

- Foundry 0.8.8 combatibility update
- Added dice so nice custom dice for Tales from the Loop

## [1.0.3]

- Code Clean up (thanks Tobias you champion!) and foundry compatibility update.

## [1.0.2] - 2021-07-18

- Japanese Localization added thanks to Brother Sharpe and asami

## [1.0.1] - 2021-05-30

- Foundry VTT 0.8.5 compatible. This fork will be the main release going forward, you must use Foundry VTT 0.8.5 or better to use this system
- Updated CSS for better readability and space usage on sheet.

## [1.0.0] - 2021-05-30

- Foundry VTT 0.8.2b compatible, this is a Fork of the main release. if you are using 0.7.9 this release will not work for you.

## [0.9.13] - 2021-03-01

- Bugfix: Item name not displayed when selecting item in rolls - FIXED
- localization <strike>types</strike> typos fixed

## [0.9.0] - 2021-02-27

- Added Swedish localization thanks to Mikael | Lagt till svensk lokalisering tack vare Mikael

## [0.8.9]

- Added Brazilian Portugese localization thanks lmartim! | Adicionado português brasileiro obrigado lmartim!

## [0.8.8] - 2021-02-06

- Added sheet for Things From the Flood Teen. Module for CSS styling is coming soom(tm)

## [0.8.7] - 2021-01-25

- added support for La france des Années 80 kid types
  - initial support for extending kid types through home brew settings not fully implemented at this time.

## [0.8.4] - 2021-01-18

- Spainish Localization | Localización del idioma español
  - Thanks to mikeldevcosmico

## [0.8.3] - 2021-01-14

- fixed Forge Bazaar issue
- fixed chat card localization on reroll bug.

## [0.8.0]

- German Language Localization | Deutschsprachige Übersetzung.
  - Thanks to GreenTea173!

## [0.7.9]

- Fixed roll logic - If a pool is 0 the pool becomes 1d6cs6 (as per the clarification in flood).
- added re-roll button to already re-rolled items to allow for expenditure of luck after a pushed roll

## [0.7.8]

- French Language Localization | Localisation de la langue française
  - thanks to Antoine and Carter!
- tweaks to CSS

## [0.7.7]

- minor bug fix.
- restrictied visibility of reroll button by owner in chat.

## [0.7.6] - 2020-12-27

- Added Re-roll buttons - Feature Complete!

## [0.7.5] - 2020-12-25

- Stytled chat and other windows to match core system
- Beutified Roll Dialog
- Added breakdown of components to the Roll Dialog (you can see why your pool is what it is)
- Styled chat card for rolls, and ensured dice so nice played well with system.

## [0.7.1]

- minor bug fix

## [0.7.0]

- Full roll Implementation complete. System is now feature complete and ready for your games.
- Minor Bug fixes
- minor CSS tweaks
