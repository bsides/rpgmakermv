//=============================================================================
// BSIDES Other IconSet Extension
// for Yanfly Engine Plugins - Item Core
// BSD_ItemBigImage.js
// Version: 1.0
//=============================================================================

var Imported = Imported || {};
Imported.BSD_OtherIconSet = true;

var BSIDES = BSIDES || {};
BSIDES.OIS = BSIDES.OIS || {};

//=============================================================================
 /*:
 * @plugindesc (Requires YEP_ItemCore.js) Allows the use of another image
 * to be used as IconSet. Good to be used in the details section.
 * @author BSIDES
 *
 * @param Icon Image
 * @desc The other, generally a bigger IconSet image.
 * @default BigIconSet
 *
 * @param Icon Width
 * @desc The width of each icon in this other IconSet.
 * @default 75
 *
 * @param Icon Height
 * @desc The height of each icon in this other IconSet.
 * @default 100
 *
 * @param Icon Smooth
 * @desc Should we render the icon smoothly?
 * @default true
 *
 * @help
 *
 * ============================================================================
 * How to?
 * ============================================================================
 * 
 * Don't forget to configure the parameters. They are pretty self explainable,
 * but if you need further help, here it goes:
 *
 * - The new IconSet image should be placed in img/system/NAME_OF_ICONSET.png.
 * Replace NAME_OF_ICONSET with the file name of your image, 
 * for example: BigIconSet.png
 *
 * - Width and Height are defined by each icon inside your iconset data. Just
 * imagine your file with a grid and measure the width and height of each
 * square. Put that in Icon Width and Icon Height parameters.
 *
 * - To define which icon to use in your item / equip / skill, just put in the
 * notetag the ROW and COLUMN that is located that item square inside your
 * IconSet. For example, if you were using the default iconset, 
 * the heart icon would be <bicon row: 6> and <bicon column: 5>.
 *
 * - Why "bicon"?
 * The first time I made this plugin I thought naming it "Bigger IconSet", but
 * as I worked on it, it became more generic than that.
 * 
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * It's super simple. Just inform the row and column placement of the icon 
 * in your new IconSet with the notetags.
 * <bicon row: y>
 * <bicon column: x>
 *
 */
//=============================================================================
if (Imported.YEP_ItemCore) {

//=============================================================================
// Parameter Variables
//=============================================================================
BSIDES.Parameters = PluginManager.parameters('BSD_OtherIconSet');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.ItemOtherIconImage = String(BSIDES.Parameters['Icon Image']);
Yanfly.Param.ItemOtherIconWidth = Number(BSIDES.Parameters['Icon Width']);
Yanfly.Param.ItemOtherIconHeight = Number(BSIDES.Parameters['Icon Height']);
Yanfly.Param.ItemOtherIconSmooth = String(BSIDES.Parameters['Icon Smooth']);


//=============================================================================
// DataManager
//=============================================================================
BSIDES.OIS.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!BSIDES.OIS.DataManager_isDatabaseLoaded.call(this)) return false;
  this.processNewNotetags($dataItems);
  this.processNewNotetags($dataWeapons);
  this.processNewNotetags($dataArmors);
  this.processNewNotetags($dataItems);
  return true;
};
DataManager.processNewNotetags = function(group) {
  var note4 = /<(?:BICON COLUMN):[ ](\d+)>/i;
  var note5 = /<(?:BICON ROW):[ ](\d+)>/i;
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.otherImageIconIndex = {};

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(note4)) {
        obj.otherImageIconIndex.column = parseInt(RegExp.$1);
      } else if (line.match(note5)) {
        obj.otherImageIconIndex.row = parseInt(RegExp.$1);
      }
   }
 }
};
Window_ItemStatus.prototype.drawLargeIcon = function() {
  var iconIndex = 0;
  var theImage = '';
  var isOtherImageDefined = false;
  if (Object.keys(this._item.otherImageIconIndex).length > 0) {
    iconIndex = this._item.otherImageIconIndex;
    isOtherImageDefined = true;
    if (Yanfly.Param.ItemOtherIconImage.trim() === '') {
      theImage = 'IconSet';
    } else {
      theImage = Yanfly.Param.ItemOtherIconImage;
    }
  } else {
    iconIndex = this._item.iconIndex;
    theImage = 'IconSet';
  }
  var bitmap = ImageManager.loadSystem(theImage);

  var pw, ph, sx, sy, dw, dh, dx, dy;
  if (isOtherImageDefined) {
    pw = Yanfly.Param.ItemOtherIconWidth;
    ph = Yanfly.Param.ItemOtherIconHeight;
    sx = iconIndex.row * pw;
    sy = iconIndex.column * ph;
  } else {
    pw = Window_Base._iconWidth;
    ph = Window_Base._iconHeight;
    sx = iconIndex % 16 * pw;
    sy = Math.floor(iconIndex / 16) * ph;
  }
  var dw = Yanfly.Param.ItemIconSize;
  var dh = Yanfly.Param.ItemIconSize;
  var dx = (Window_Base._faceWidth - dw) / 2;
  var dy = (Window_Base._faceHeight - dh) / 2;
  this.contents._context.imageSmoothingEnabled = eval(Yanfly.Param.ItemOtherIconSmooth);
  this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, dw, dh);
  this.contents._context.imageSmoothingEnabled = true;
};

//=============================================================================
// Preloads the IconSet
//=============================================================================
if (Yanfly.Param.ItemOtherIconImage !== '' || typeof Yanfly.Param.ItemOtherIconImage !== 'undefined') {
  ImageManager.loadSystem(Yanfly.Param.ItemOtherIconImage);
};

//=============================================================================
// End of file
//=============================================================================
};