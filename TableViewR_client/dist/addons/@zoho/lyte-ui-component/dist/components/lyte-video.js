/**
 * This component is used to render a video content in the document
 * @component lyte-video
 * @version 3.45.0
 * @dependency lyte-multislider
 *  components/lyte-multislider
 * 	theme/compiledCSS/default/ltr/lyte-ui-slider.css
 * @methods onVolumeChange, onProgress, onPause, onPlay, onScreenShot, onMenuClick, onBeforePreFetch, onPreFetchSuccess,onPreFetchError, onEnded 
 * @utility play,pause,screenShot 
**/
Lyte.Component.register( "lyte-video", {
_template:"<template tag-name=\"lyte-video\"> <div tabindex=\"0\" aria-valuetext=\"video\" class=\"lyteVideoContainer lyteVideoControlsShow\" onpointerenter=\"{{action('mouseEnter',event,this)}}\" onpointerleave=\"{{action('mouseLeave',this)}}\" onpointermove=\"{{action('mouseMove',event,this)}}\" onkeydown=\"{{action('keyDown',event)}}\"> <div class=\"lyteVideoAnimateWrapper lyteVideoAnimateBackward\"> <span class=\"lyteVideoAnimateBackArrow lyteVideoAnimateArrow3\"></span> <span class=\"lyteVideoAnimateBackArrow lyteVideoAnimateArrow2\"></span> <span class=\"lyteVideoAnimateBackArrow lyteVideoAnimateArrow1\"></span> </div> <div class=\"lyteVideoAnimateWrapper lyteVideoAnimatePlay\"> <span class=\"lyteVideoAnimatePauseIcon\"></span> </div> <div class=\"lyteVideoAnimateWrapper lyteVideoAnimateForward\"> <span class=\"lyteVideoAnimateForwardArrow lyteVideoAnimateArrow1\"></span> <span class=\"lyteVideoAnimateForwardArrow lyteVideoAnimateArrow2\"></span> <span class=\"lyteVideoAnimateForwardArrow lyteVideoAnimateArrow3\"></span> </div> <template is=\"if\" value=\"{{expHandlers(expHandlers(renderPrefetch,'&amp;&amp;',expHandlers(prefetchLoading,'==',&quot;lyteVideoPrefetchLoading&quot;)),'||',expHandlers(expHandlers(renderPrefetch,'!'),'&amp;&amp;',expHandlers(canPlay,'!')))}}\"><template case=\"true\"> <div class=\"lyteVideoPrefetchLoadingContainer {{if(initialLoad,'lyteVideoPrefetchInitialLoadingContainer','')}}\"> <div class=\"lyteCircleLoader\"> <span class=\"lyteCircleInnerLoader\"></span> </div> </div> </template></template> <canvas class=\"lyteVideoPoster {{if(hidePoster,'lyteVideoPosterHide','')}} {{if(renderPrefetch,'lyteVideoPosterBeforeVideoLoad','')}}\" onclick=\"{{action('clickOnVideo')}}\"></canvas> <template is=\"if\" value=\"{{renderPrefetch}}\"><template case=\"true\"> <div class=\"lyteVideoControls hoverControls lyteVideoPrefetchControlsContainer\"> <div class=\"lyteVideoProgressWrapper\"> <div class=\"lyteVideoProgressBar\"> <span class=\"lyteVideoProgressHandler\" style=\"left: 0;\"></span> </div> <div class=\"lyteVideoTimer\"> <time class=\"duration\">{{currentDuration}}</time> <span class=\"lyteVideoTimerSeparator\">/</span> <time>{{duration}}</time> </div> </div> <div class=\"lyteVideoIconsWrap\"> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.play,'!=',false)}}\"><template case=\"true\"><div class=\"lyteVideoPlayPauseIconWrap\"> <span class=\"lyteVideoIcons lyteVideoPlayIcon lyteVideoPaused\" lt-prop-title=\"{{videoStatus}}\" onclick=\"{{action('prefetch',this)}}\"></span> </div></template></template> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.backward,'!=',false)}}\"><template case=\"true\"><div class=\"lyteVideoRewind\"> <span class=\"lyteVideoIcons lyteVideoRewindIcon\" lt-prop-title=\"Play the video to enable controls\"></span> </div></template></template> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.forward,'!=',false)}}\"><template case=\"true\"><div class=\"lyteVideoForward\"> <span class=\"lyteVideoIcons lyteVideoForwardIcon\" lt-prop-title=\"Play the video to enable controls\"></span> </div></template></template> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.volume,'!=',false)}}\"><template case=\"true\"><div class=\"lyteVideoVolumeControls\"> <span class=\"lyteVideoVolumeIcon\" lt-prop-title=\"{{volumeStatus}}\" onclick=\"{{action('mute',this)}}\"></span> <div class=\"lyteVideoVolumeSlider\"> <lyte-multislider lt-prop-css-direction=\"ltr\" lt-prop-max=\"1\" lt-prop-yield=\"true\" lt-prop-handler=\"lyteCircle\" lt-prop-value=\"[ { &quot;value&quot; : {{volume}}, &quot;min&quot; : 0, &quot;max&quot; : 1 } ]\" on-change=\"{{method('setVolume')}}\"></lyte-multislider> </div> </div></template></template> <div class=\"lyteVideoRightIcons\"> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.settings,'!=',false)}}\"><template case=\"true\"><div class=\"lyteVideoSettings\"> <span class=\"lyteVideoIcons lyteVideoSettingsIcon\" lt-prop-title=\"Play the video to enable controls\"></span> </div></template></template> <template is=\"if\" value=\"{{isNotFirefox}}\"><template case=\"true\"> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.pip,'!=',false)}}\"><template case=\"true\"><div class=\"lyteVideoPip\"> <span class=\"lyteVideoIcons lyteVideoPipIcon\" lt-prop-title=\"Play the video to enable controls\"></span> </div></template></template> </template></template> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.fullScreen,'!=',false)}}\"><template case=\"true\"><div class=\"lyteVideoFullScreenControl\"> <span class=\"lyteVideoIcons lyteVideoFullScreen\" lt-prop-title=\"Play the video to enable controls\"></span> </div></template></template> </div> </div> </div> </template><template case=\"false\"> <template is=\"if\" value=\"{{ltPropMiniMode}}\"><template case=\"true\"> <lyte-pip lt-prop-pip-mode=\"{{miniMode}}\" lt-prop-use-browser-api=\"false\" lt-prop-resize=\"{{miniModeOptions.resize}}\" lt-prop-draggable=\"{{miniModeOptions.draggable}}\" lt-prop-resize-max-width=\"{{miniModeOptions.resizeMaxWidth}}\" lt-prop-resize-min-width=\"{{miniModeOptions.resizeMinWidth}}\" lt-prop-resize-max-height=\"{{miniModeOptions.resizeMaxHeight}}\" lt-prop-resize-min-height=\"{{miniModeOptions.resizeMinHeight}}\" lt-prop-header-yield=\"{{miniModeOptions.headerYield}}\" lt-prop-footer-yield=\"{{miniModeOptions.footerYield}}\" lt-prop-pip-window-width=\"{{miniModeOptions.miniWindowWidth}}\" lt-prop-pip-window-height=\"{{miniModeOptions.miniWindowHeight}}\"> <template is=\"registerYield\" yield-name=\"header\"> <lyte-yield yield-name=\"header\"></lyte-yield> </template> <template is=\"registerYield\" yield-name=\"video\"> <div class=\"lyteVideoMiniContainer\" onpointerenter=\"{{action('mouseEnter',event,this)}}\" onpointerleave=\"{{action('mouseLeave',event,this)}}\" onpointermove=\"{{action('mouseMove',event,this)}}\"> <div class=\"lytePipFullScreenIconContainer\" onclick=\"{{action('toggleMiniMode')}}\"> <div class=\"lytePipFullScreenIcon\"></div> </div> <div class=\"lytePipCloseIconContainer\" onclick=\"{{action('toggleMiniMode',true)}}\"> <div class=\"lytePipCloseIcon\"></div> </div> </div> </template> <template is=\"registerYield\" yield-name=\"footer\"> <lyte-yield yield-name=\"footer\"></lyte-yield> </template> </lyte-pip> </template></template> <video class=\"lyteVideo\" onvolumechange=\"{{action('changeVolume',event)}}\" preload=\"{{ltPropPreLoad}}\" ontimeupdate=\"{{action('update',event)}}\" onloadeddata=\"{{action('progress',event)}}\" onprogress=\"{{action('progress',event)}}\" onloadedmetadata=\"{{action('meta',event)}}\" onpause=\"{{action('pause',event)}}\" onplay=\"{{action('play',event)}}\" onclick=\"{{action('clickOnVideo')}}\" ondblclick=\"{{action('toggleFullScreen')}}\" oncanplay=\"{{action('onCanPlay')}}\" onwaiting=\"{{action('onWaiting',false)}}\" onplaying=\"{{action('onWaiting',true)}}\"> <source src=\"{{ltPropSource[0].src}}\" type=\"{{ltPropSource[0].type}}\" label=\"{{ltPropSource[0].label}}\" size=\"{{ltPropSource[0].size}}\"> <template is=\"if\" value=\"{{ltPropTracks}}\"><template case=\"true\"> <track> </template></template> </video> <template is=\"if\" value=\"{{subtitles}}\"><template case=\"true\"> <div class=\"lyteVideoSubtitleWrapper\"> <p class=\"lyteVideoSubtitle\">{{subText}}</p> </div> </template></template> <div class=\"lyteVideoControls hoverControls\"> <div class=\"lyteVideoProgressWrapper\"> <div class=\"lyteVideoProgressBar\" role=\"slider\" aria-label=\"Seek Slider\" aria-valuemin=\"0\" aria-valuemax=\"{{durationSec}}\" aria-valuenow=\"{{elapsedTime}}\" aria-valuetext=\"\" tabindex=\"0\" onclick=\"{{action('progressClick',event)}}\" onmousemove=\"{{action('updateToolTip',event)}}\"> <template is=\"if\" value=\"{{expHandlers(miniMode,'!')}}\"><template case=\"true\"><div class=\"lyteVideoToolTip\"> <div> <p class=\"lyteVideoTooltipChapterName\">{{toolTip.name}}</p> <p class=\"lyteVideoTooltipCurrentTime\">{{toolTip.time}}</p> </div> </div></template></template> <template is=\"if\" value=\"{{chaptersData}}\"><template case=\"true\"> <div class=\"lyteVideoChapterWrapper\"> <template is=\"for\" items=\"{{chaptersData}}\" item=\"item\" index=\"index\"> <div class=\"lyteVideoChapter\" data-start=\"{{item.startTime}}\" data-end=\"{{item.endTime}}\" data-label=\"{{item.title}}\" style=\"width: {{item.width}}%;\"> <span class=\"lyteVideoProgressed\" style=\"width: {{item.time}}%;\"></span> <span class=\"lyteVideoProgressLoad\" style=\" width : {{item.loadedTime}}%\"></span> </div> </template> </div> </template><template case=\"false\"> <span class=\"lyteVideoProgressed\" style=\"width: {{elapsedTime}}%;\"></span> <span class=\"lyteVideoProgressLoad\" style=\" width : {{loadedTime}}%\"></span> </template></template> <span class=\"lyteVideoProgressHandler\" ontouchstart=\"{{action('progressMouseDown',event)}}\" onmousedown=\"{{action('progressMouseDown',event)}}\" style=\"left: 0;\"></span> </div> <div class=\"lyteVideoTimer\"> <time class=\"duration\">{{currentDuration}}</time> <span class=\"lyteVideoTimerSeparator\">/</span> <time>{{duration}}</time> </div> </div> <div class=\"lyteVideoIconsWrap\"> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.play,'!=',false)}}\"><template case=\"true\"><div tabindex=\"0\" aria-keyshortcuts=\"k\" aria-label=\"{{videoStatus}} keyboard shortcut k\" class=\"lyteVideoPlayPauseIconWrap\" onclick=\"{{action('togglePlayPause',this)}}\"> <span class=\"lyteVideoIcons lyteVideoPlayIcon lyteVideoPaused\" lt-prop-title=\"{{videoStatus}} (k)\"></span> </div></template></template> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.backward,'!=',false)}}\"><template case=\"true\"><div tabindex=\"0\" aria-label=\"{{lyteUiI18n('lyte.video.skip.backward')}}\" class=\"lyteVideoRewind\" onclick=\"{{action('skipVideo','rewind')}}\"> <span class=\"lyteVideoIcons lyteVideoRewindIcon {{backwardStatus}}\" lt-prop-title=\"{{lyteUiI18n('lyte.video.skip.backward')}}\"></span> </div></template></template> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.forward,'!=',false)}}\"><template case=\"true\"><div tabindex=\"0\" aria-label=\"{{lyteUiI18n('lyte.video.skip.forward')}}\" class=\"lyteVideoForward\" onclick=\"{{action('skipVideo','forward')}}\"> <span class=\"lyteVideoIcons lyteVideoForwardIcon {{forwardStatus}}\" lt-prop-title=\"{{lyteUiI18n('lyte.video.skip.forward')}}\"></span> </div></template></template> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.volume,'!=',false)}}\"><template case=\"true\"><div class=\"lyteVideoVolumeControls\"> <span tabindex=\"0\" aria-label=\"{{volumeStatus}} keyboard shortcut m\" aria-keyshortcuts=\"m\" class=\"lyteVideoVolumeIcon\" lt-prop-title=\"{{volumeStatus}} (m)\" onclick=\"{{action('mute',this)}}\"></span> <div class=\"lyteVideoVolumeSlider\"> <lyte-multislider lt-prop-aria=\"true\" lt-prop-css-direction=\"ltr\" lt-prop-max=\"1\" lt-prop-yield=\"true\" lt-prop-handler=\"lyteCircle\" lt-prop-value=\"{{sliderData}}\" on-change=\"{{method('setVolume')}}\" lt-prop-tabindex=\"-1\"></lyte-multislider> </div> </div></template></template> <div class=\"lyteVideoRightIcons\"> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.settings,'!=',false)}}\"><template case=\"true\"><div tabindex=\"0\" aria-label=\"{{lyteUiI18n('lyte.video.settings')}}\" class=\"lyteVideoSettings\" onclick=\"{{action('toggleSettings',event)}}\"> <span class=\"lyteVideoIcons lyteVideoSettingsIcon\" lt-prop-title=\"{{lyteUiI18n('lyte.video.settings')}}\"></span> </div></template></template> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.settings,'!=',false)}}\"><template case=\"true\"><div role=\"menu\" class=\"lyteVideoSettingsWrapper lyteVideoSettingsItemHover lyteVideoMenuHide\" onmouseover=\"{{action('mouseOver')}}\"> <template is=\"if\" value=\"{{subMenuOpened}}\"><template case=\"true\"> <div data-value=\"back\" role=\"menuitem\" tabindex=\"0\" class=\"lyteVideoSettingsDropdownHead\" onclick=\"{{action('settingsMenuClick',this)}}\"> <div class=\"lyteVideoSettingsBackIcon\"></div> <span class=\"lyteVideoSettingsLabel\">{{lyteUiI18n(lyteUiConcat('lyte.video.menu.',selectedOption))}}</span> </div> </template></template> <template is=\"switch\" value=\"{{selectedOption}}\"><template case=\"playBackSpeed\"><template is=\"for\" items=\"{{speedData}}\" item=\"item\" index=\"index\"> <div tabindex=\"0\" role=\"menuitem\" aria-label=\"{{item.label}}\" data-value=\"{{item.label}}\" class=\"lyteVideoSettingDropItem lyteVideoPl-40 {{lyteUiSetSelectedClass(item.label,ltPropPlayRate)}}\" onclick=\"{{action('settingsMenuClick',this)}}\"> <span class=\"lyteVideoSettingsLabel\">{{item.label}} </span> </div> </template></template><template case=\"qualityOption\"> <div tabindex=\"0\" role=\"menuitem\" aria-label=\"{{lyteUiI18n('lyte.video.menu.qualityOption.auto')}}\" data-value=\"auto\" class=\"lyteVideoSettingDropItem lyteVideoPl-40 {{lyteUiSetSelectedClass('auto',ltPropQuality)}}\" onclick=\"{{action('settingsMenuClick',this)}}\"> <span class=\"lyteVideoSettingsLabel\">{{lyteUiI18n(\"lyte.video.menu.qualityOption.auto\")}}</span> </div> <template is=\"for\" items=\"{{ltPropSource}}\" item=\"item\" index=\"index\"> <template is=\"if\" value=\"{{item.size}}\"><template case=\"true\"><div tabindex=\"0\" role=\"menuitem\" aria-label=\"{{item.size}}\" data-value=\"{{item.size}}\" class=\"lyteVideoSettingDropItem lyteVideoPl-40 {{lyteUiSetSelectedClass(item.size,ltPropQuality)}}\" onclick=\"{{action('settingsMenuClick',this)}}\"> <span class=\"lyteVideoSettingsLabel\">{{item.size}} </span> </div></template></template> </template></template><template case=\"subtitles\"> <div tabindex=\"0\" role=\"menuitem\" aria-label=\"{{lyteUiI18n('lyte.video.menu.subtitles.off')}}\" data-value=\"off\" class=\"lyteVideoSettingDropItem lyteVideoPl-40 {{lyteUiSetSelectedClass('off',ltPropCaption)}}\" onclick=\"{{action('settingsMenuClick',this)}}\"> <span class=\"lyteVideoSettingsLabel\">{{lyteUiI18n(\"lyte.video.menu.subtitles.off\")}}</span> </div> <template is=\"for\" items=\"{{ltPropTracks}}\" item=\"item\" index=\"index\"> <div tabindex=\"0\" role=\"menuitem\" aria-label=\"item.label\" data-value=\"{{item.label}}\" class=\"lyteVideoSettingDropItem lyteVideoPl-40 {{lyteUiSetSelectedClass(item.label,ltPropCaption)}}\" onclick=\"{{action('settingsMenuClick',this)}}\"> <span class=\"lyteVideoSettingsLabel\">{{item.label}} </span> </div> </template></template><template default=\"\"> <div tabindex=\"0\" role=\"menuitem\" aria-haspopup=\"true\" aria-label=\"{{lyteUiI18n('lyte.video.menu.subtitles')}}\" data-value=\"subtitles\" class=\"lyteVideoSettingsItem \" onclick=\"{{action('settingsMenuClick',this)}}\"> <span class=\"lyteVideoSettingsLabel\">{{lyteUiI18n(\"lyte.video.menu.subtitles\")}} </span> <span class=\"lyteVideoSettingsKey\">{{lyteUiI18n(lyteUiConcat('lyte.video.menu.subtitles.',ltPropCaption))}}</span> </div> <div tabindex=\"0\" role=\"menuitem\" aria-haspopup=\"true\" aria-label=\"{{lyteUiI18n('lyte.video.menu.playBackSpeed')}}\" data-value=\"playBackSpeed\" class=\"lyteVideoSettingsItem\" onclick=\"{{action('settingsMenuClick',this)}}\"> <span class=\"lyteVideoSettingsLabel\">{{lyteUiI18n(\"lyte.video.menu.playBackSpeed\")}} </span> <span class=\"lyteVideoSettingsKey\">{{ltPropPlayRate}}</span> </div> <div tabindex=\"0\" role=\"menuitem\" aria-haspopup=\"true\" aria-label=\"{{lyteUiI18n('lyte.video.menu.qualityOption')}}\" data-value=\"qualityOption\" class=\"lyteVideoSettingsItem\" onclick=\"{{action('settingsMenuClick',this)}}\"> <span class=\"lyteVideoSettingsLabel\">{{lyteUiI18n(\"lyte.video.menu.qualityOption\")}} </span> <span class=\"lyteVideoSettingsKey\">{{getQualityI18n(ltPropQuality)}}</span> </div> </template></template> </div></template></template> <template is=\"if\" value=\"{{ltPropMiniMode}}\"><template case=\"true\"><div tabindex=\"0\" aria-label=\"{{lyteUiI18n('lyte.video.mode.miniMode')}}\" class=\"lyteVideoPip\" onclick=\"{{action('toggleMiniMode')}}\"> <span class=\"lyteVideoIcons lyteVideoPipIcon\" lt-prop-title=\"{{lyteUiI18n('lyte.video.mode.miniMode')}}\"></span> </div></template></template> <template is=\"if\" value=\"{{isNotFirefox}}\"><template case=\"true\"> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.pip,'!=',false)}}\"><template case=\"true\"><div tabindex=\"0\" aria-label=\"{{lyteUiI18n('lyte.video.mode.pip')}}\" class=\"lyteVideoPip\" onclick=\"{{action('togglePip')}}\"> <span class=\"lyteVideoIcons lyteVideoPipIcon\" lt-prop-title=\"{{lyteUiI18n('lyte.video.mode.pip')}}\"></span> </div></template></template> </template></template> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.fullScreen,'!=',false)}}\"><template case=\"true\"><div tabindex=\"0\" aria-keyshortcuts=\"f\" aria-label=\"{{lyteUiI18n('lyte.video.mode.fullScreen')}} keyboard shortcut f\" class=\"lyteVideoFullScreenControl\" onclick=\"{{action('toggleFullScreen',this)}}\"> <span class=\"lyteVideoIcons lyteVideoFullScreen\" lt-prop-title=\"{{lyteUiI18n('lyte.video.mode.fullScreen')}} (f)\"></span> </div></template></template> </div> </div> </div> </template></template> </div> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"attr","position":[1,7]},{"type":"if","position":[1,7],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]}]}},"default":{}},{"type":"attr","position":[1,9]},{"type":"attr","position":[1,11]},{"type":"if","position":[1,11],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,3,1,0]},{"type":"text","position":[1,1,3,5,0]},{"type":"attr","position":[1,3,1]},{"type":"if","position":[1,3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0,1]}]}},"default":{}},{"type":"attr","position":[1,3,3]},{"type":"if","position":[1,3,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[1,3,5]},{"type":"if","position":[1,3,5],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[1,3,7]},{"type":"if","position":[1,3,7],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"attr","position":[0,3,1]},{"type":"componentDynamic","position":[0,3,1]}]}},"default":{}},{"type":"attr","position":[1,3,9,1]},{"type":"if","position":[1,3,9,1],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[1,3,9,3]},{"type":"if","position":[1,3,9,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[]}},"default":{}}]}},"default":{}},{"type":"attr","position":[1,3,9,5]},{"type":"if","position":[1,3,9,5],"cases":{"true":{"dynamicNodes":[]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"insertYield","position":[1]}]},{"type":"registerYield","position":[1,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]}]},{"type":"registerYield","position":[1,5],"dynamicNodes":[{"type":"insertYield","position":[1]}]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"attr","position":[3,1]},{"type":"attr","position":[3,3]},{"type":"if","position":[3,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[5]},{"type":"if","position":[5],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]}]}},"default":{}},{"type":"attr","position":[7,1,1]},{"type":"attr","position":[7,1,1,1]},{"type":"if","position":[7,1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[0,1,1,0]},{"type":"text","position":[0,1,3,0]}]}},"default":{}},{"type":"attr","position":[7,1,1,3]},{"type":"if","position":[7,1,1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'width: '","item.width","'%;'"]}}}},{"type":"attr","position":[1,1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'width: '","item.time","'%;'"]}}}},{"type":"attr","position":[1,3],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["' width : '","item.loadedTime","'%'"]}}}}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'width: '","elapsedTime","'%;'"]}}}},{"type":"attr","position":[3],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["' width : '","loadedTime","'%'"]}}}}]}},"default":{}},{"type":"attr","position":[7,1,1,5]},{"type":"text","position":[7,1,3,1,0]},{"type":"text","position":[7,1,3,5,0]},{"type":"attr","position":[7,3,1]},{"type":"if","position":[7,3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]}]}},"default":{}},{"type":"attr","position":[7,3,3]},{"type":"if","position":[7,3,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]}]}},"default":{}},{"type":"attr","position":[7,3,5]},{"type":"if","position":[7,3,5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]}]}},"default":{}},{"type":"attr","position":[7,3,7]},{"type":"if","position":[7,3,7],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"attr","position":[0,3,1]},{"type":"componentDynamic","position":[0,3,1]}]}},"default":{}},{"type":"attr","position":[7,3,9,1]},{"type":"if","position":[7,3,9,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]}]}},"default":{}},{"type":"attr","position":[7,3,9,3]},{"type":"if","position":[7,3,9,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,3,0]}]}},"default":{}},{"type":"attr","position":[0,3]},{"type":"switch","position":[0,3],"cases":{"playBackSpeed":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"for","position":[0],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]}]}]},"qualityOption":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"attr","position":[3]},{"type":"for","position":[3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"text","position":[0,1,0]}]}},"default":{}}]}]},"subtitles":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"attr","position":[3]},{"type":"for","position":[3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]}]}]}},"default":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"text","position":[1,3,0]},{"type":"attr","position":[3]},{"type":"text","position":[3,1,0]},{"type":"text","position":[3,3,0]},{"type":"attr","position":[5]},{"type":"text","position":[5,1,0]},{"type":"text","position":[5,3,0]}]}}]}},"default":{}},{"type":"attr","position":[7,3,9,5]},{"type":"if","position":[7,3,9,5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]}]}},"default":{}},{"type":"attr","position":[7,3,9,7]},{"type":"if","position":[7,3,9,7],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[7,3,9,9]},{"type":"if","position":[7,3,9,9],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]}]}},"default":{}}]}},"default":{}}],
_observedAttributes :["ltPropSource","ltPropTracks","ltPropVolume","ltPropMuted","ltPropPlayRate","ltPropCrossOrigin","ltPropCurrentTime","ltPropChapters","ltPropWidth","ltPropHeight","ltPropLoop","ltPropPreLoad","ltPropAutoPlay","ltPropPoster","ltPropCaption","ltPropQuality","ltPropOptions","ltPropPrefetch","ltPropPrefetchOptions","ltPropFocus","ltPropMiniMode","ltPropMiniModeOptions","isNotFirefox","volume","selectedOption","elapsedTime","loadedTime","toolTip","currentDuration","duration","subMenuOpened","speedData","captionsData","qualityData","chaptersData","subtitles","subText","selectedSource","renderPrefetch","prefetchLoading","metaSetted","durationSec","videoStatus","volumeStatus","forwardStatus","backwardStatus","canPlay","sliderData"],

	data : function(){
		return{
            /**
			 * @componentProperty {Object[]} ltPropSource
			 * @version 3.45.0
			 */
			ltPropSource : Lyte.attr( 'array' ),
            /**
			 * @componentProperty {Object[]} ltPropTracks
			 * @version 3.45.0
			 */
			ltPropTracks : Lyte.attr( 'array' ),
            /**
			 * @componentProperty {number} ltPropVolume=1
			 * @version 3.45.0
			 */
			ltPropVolume : Lyte.attr( 'number', { default : 1 }),
            /**
			 * @componentProperty {boolean} ltPropMuted
			 * @version 3.45.0
			 */
            ltPropMuted : Lyte.attr( 'boolean' ),
            /**
			 * @componentProperty {number} ltPropPlayRate=1
			 * @version 3.86.0
			 */
			ltPropPlayRate : Lyte.attr( 'number', { default : 1 }),
            /**
			 * @componentProperty {string} ltPropCrossOrigin=''
			 * @version 3.45.0
			 */
			ltPropCrossOrigin : Lyte.attr('string'),
            /**
			 * @componentProperty {number} ltPropCurrentTime
			 * @version 3.45.0
			 */
			ltPropCurrentTime : Lyte.attr( 'number' ),
            /**
			 * @componentProperty {Object[]} ltPropChapters
			 * @version 3.45.0
			 */
			ltPropChapters : Lyte.attr( 'array' ),
            /**
			 * @componentProperty {string} ltPropWidth='900px'
			 * @version 3.45.0
			 */
			ltPropWidth : Lyte.attr( 'string',{ default : '900px'} ),
            /**
			 * @componentProperty {string} ltPropHeight='500px'
			 * @version 3.45.0
			 */
			ltPropHeight : Lyte.attr( 'string',{ default : '500px'} ),
            /**
			 * @componentProperty {string} ltPropWidth='900px'
			 * @version 3.45.0
			 */
			ltPropLoop : Lyte.attr( 'boolean'),
             /**
			 * @componentProperty {boolean} ltPropLoop
			 * @version 3.45.0
			 */
            ltPropPreLoad : Lyte.attr( 'string', { default : 'metadata'} ),
             /**
			 * @componentProperty {string} ltPropPreLoad='metadata'
			 * @version 3.45.0
			 */
            ltPropAutoPlay : Lyte.attr( 'boolean' ),
             /**
			 * @componentProperty {boolean} ltPropAutoPlay
			 * @version 3.45.0
			 */
            ltPropPoster : Lyte.attr( 'string' ),
             /**
			 * @componentProperty {string} ltPropPoster
			 * @version 3.45.0
			 */
            ltPropCaption : Lyte.attr( 'string', { default : 'off'} ),
             /**
			 * @componentProperty {string} ltPropCaption='off'
			 * @version 3.45.0
			 */
            ltPropQuality : Lyte.attr( 'string' , { default : 'auto'} ),
             /**
			 * @componentProperty {string} ltPropQuality='auto'
			 * @version 3.45.0
			 */
            ltPropOptions : Lyte.attr( 'object', { default : {}}),
             /**
			 * @componentProperty {object} ltPropOptions
             * @default {}
			 * @version 3.71.0
			 */
            ltPropPrefetch :  Lyte.attr( 'boolean', { default : false } ),
            /**
			 * @componentProperty {boolean} ltPropPrefetch=false
			 * @version 3.71.0
			 */
            ltPropPrefetchOptions : Lyte.attr( 'object', { default : {
                method:'GET',
                mode:'cors'
                }
            }),
            /**
             * @componentProperty {object} ltPropPrefetchOptions
             * @default {"method":"GET","mode":"cors"}
             * @version 3.71.0
             */ 
            ltPropFocus :  Lyte.attr( 'boolean', { default : false } ),
            /**
			 * @componentProperty {boolean} ltPropFocus=false
			 * @version 3.88.1
			 */
            ltPropMiniMode :  Lyte.attr( 'boolean', { default : false } ),
            // /**
			//  * @componentProperty {boolean} ltPropMiniMode=false
			//  * @version 3.91.1
			//  */
            ltPropMiniModeOptions :  Lyte.attr( 'object', { default : {} } ),
            // /**
			//  * @componentProperty {object} ltPropMiniModeOptions
			//  * @version 3.91.1
			//  */
			//system data
            isNotFirefox : Lyte.attr( 'boolean', { default :  
                _lyteUiUtils.getBrowser() != "firefox" } ),
			volume :  Lyte.attr( 'number', { default : 0 }),
			selectedOption : Lyte.attr( 'string', { default : 'settings'}),
			elapsedTime : Lyte.attr( 'number', { default : 0}),
			loadedTime : Lyte.attr( 'number', { default : 0}),
			toolTip : Lyte.attr( 'object', { default : { 'name' : '', 'time' : '00:00' }}),
			currentDuration : Lyte.attr( 'string', { default : '00:00'}),
			duration : Lyte.attr( 'string', { default : '00:00'}),
			subMenuOpened : Lyte.attr( 'boolean', { default : false }),
			speedData : Lyte.attr( 'array', { default : [
				{ "label" : "0.25" },
				{ "label" : "0.5" },
				{ "label" : "1" },
				{ "label" : "1.25" },
				{ "label" : "1.5" },
				{ "label" : "1.75" },
				{ "label" : "2" }
			]}),
			captionsData : Lyte.attr( 'array', { default : [
				{ "label" : "off"}
			]}),
			qualityData : Lyte.attr( 'array', { default : [
				{ "label" : "auto" }
			]}),
			chaptersData : Lyte.attr( 'array' ),
            subtitles : Lyte.attr( 'array'),
            subText : Lyte.attr( 'string', { default : ''}),
            selectedSource :  Lyte.attr( 'number', { default : 0 } ),
            renderPrefetch : Lyte.attr( 'boolean', { default : false } ),
			prefetchLoading : Lyte.attr( 'string', { default : '' } ),
            metaSetted : Lyte.attr( 'boolean', { default : false } ),
            durationSec : Lyte.attr( 'number', { default : 0 }),
            videoStatus : Lyte.attr( 'string', { default : _lyteUiUtils.i18n( "lyte.video.play" ) } ),
            volumeStatus : Lyte.attr( 'string', { default : _lyteUiUtils.i18n( "lyte.video.volume.mute" ) } ),
            forwardStatus : Lyte.attr( 'string', { default : '' } ),
            backwardStatus : Lyte.attr( 'string', { default : 'lyteVideoIconDisabled'} ),
            canPlay : Lyte.attr( 'boolean', { default : false }),
            sliderData : Lyte.attr('array', { default : [ { "value" : 0, "min" : 0, "max" : 1, "tabindex" : "0" } ] })
		}
	},

	init : function(){
		// this.setData('volume',this.getData('ltPropVolume'));
	},

	didConnect : function(){
        if( !this.data.ltPropPrefetch ){
            this.setGlobals();
        }else{
            this.setData( "renderPrefetch", true );
        }

		this._timerIdx;
		this._menuIdx = 0;
        this._focused =  this.data.ltPropFocus || false;
        this._subIdx = 0;

		this.$node.screenShot = this.screenShot.bind( this );
        this.$node.play = this.play.bind( this );
        this.$node.pause = this.pause.bind( this );
        const poster = this.data.ltPropPoster;
        if( poster && isNaN( poster ) ){
            this.getImage( poster )
        }else{
            this.drawImage( undefined, 'black' );
        }
	},

    setGlobals : function(){
        this._video = this.$node.querySelector( "video" );
		this._animationWrapper = this.$node.querySelectorAll('.lyteVideoAnimateWrapper');
		this._controls = this.$node.querySelector('.lyteVideoControls');
		this._menu = this.$node.querySelector('.lyteVideoSettingsWrapper');
		this._handler = this.$node.querySelector('.lyteVideoProgressHandler');
		this._playIcon = this.$node.querySelector('.lyteVideoPlayIcon');
        this._container = this.$node.querySelector( '.lyteVideoContainer');
        this._slider = this.$node.querySelector('lyte-multislider');
        if( this.data.ltPropCrossOrigin ){
            this._video.setAttribute("crossorigin", this.data.ltPropCrossOrigin );
        }
        if( this._menu ){
            this._menu.style.right = "70px";
        }
    },

	didDestroy : function(){
		// document.body.removeEventListener('keydown', this._keyDown);
		if( this.__preloaded ){
			var src = this.data.ltPropSource;
            for( var i = 0;i < src.length; i++ ){
                URL.revokeObjectURL( src[ i ].src );
            }
		}
		delete this._video;
		delete this._playIcon;
		delete this._handler;
		delete this._controls;
		delete this._menu;
		delete this._progressBar;
		delete this._menuListener;
		// delete this._keyDown;
        delete this._focused;
        delete this._menuIdx;
        delete this._controls;
        delete this._slider;
	},

    formatTime : function( timeInSeconds ){
        if( timeInSeconds ){
		    var result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
            time = result.substr( 0, 2) != '00' ? result.substr( 0, 2) + ':' + result.substr(3, 2) + ':' + result.substr(6, 2) : result.substr(3, 2) + ':' + result.substr(6, 2);
            return time;
        }else{
            return "00:00";
        }
	},

    convertToSeconds : function( time ){
        var sec = 0;
        sec = parseInt( time.substr( 0, 2) * 3600 ) + parseInt( time.substr( 3, 2) * 60 ) + parseInt( time.substr( 6, 2) );

        return sec; 
    },

    screenShot : function(){
        var that = this,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        video = this._video;

        ctx.canvas.width = video.videoWidth;
        ctx.canvas.height = video.videoHeight;

        createImageBitmap(video).then(function(frame) {
            ctx.drawImage(frame, 0, 0);
        }).then(  function(){
            var url =  canvas.toDataURL();
            that.getMethods('onScreenShot') && that.executeMethod( 'onScreenShot', url, that.$node); 
        });
    },
    classHandler : function( node, action, className ){
        if( node ){
            node.classList[ action ]( className );
        }
    },
    setDefault : function(){
        let video = this._video,
        playbackRate = this.getData('ltPropPlayRate'),
        startTime = this.getData( 'ltPropCurrentTime'),
        loop = this.getData( 'ltPropLoop' ),
        autoPlay = this.getData( 'ltPropAutoPlay'),
        chapters = this.getData( 'ltPropChapters'),
        poster = this.getData( 'ltPropPoster' ),
        sources = this.getData( 'ltPropSource' ),
        prefetch = this.getData( 'ltPropPrefetch'),
        muted = this.getData( 'ltPropMuted' ),
        flag = sources[ 0 ].src.includes( "blob:" ),
        miniModeOptions = {
            "resize" : false,
            "draggable" : false,
            "miniWindowWidth" : "400px",
            "miniWindowHeight" : "225px",
            "resizeMinWidth" : "200px",
            "resizeMaxWidth" : video.videoWidth + "px",
            "resizeMinHeight" : "200px",
            "resizeMaxHeight" : video.videoHeight + "px"
        }
        this.setData( "miniModeOptions", Object.assign( miniModeOptions, this.data.ltPropMiniModeOptions ) );
        Lyte.objectUtils( this.data.sliderData[0], "add", "value", this.data.ltPropVolume );
        this._slider && this._slider.reRender && this._slider.reRender();
        video.oncontextmenu = function(){ return false };
        video.onended = function(){
            this.getMethods('onEnded') && this.executeMethod( 'onEnded', this.$node ); 
        }.bind( this );

        if( muted ){
            this._video.muted = true;
        }
        if( !navigator.maxTouchPoints ){
            var tooltip = this.$node.querySelector(".lyteVideoToolTip");
            this.classHandler( tooltip, "add", "lyteVideoToolTipHover" );
        }
        if( poster && !isNaN( poster ) ){;
            this.drawImage( poster, true );
        }
        
        
        if( prefetch && !flag ){
            this.setData( "renderPrefetch", true );
            // this.prefetch();
            return;
        }

        if( startTime ){
            video.currentTime = startTime;
        }

        if( autoPlay ){
            video.setAttribute( 'autoplay', '');
        }

        if( playbackRate ){
            video.playbackRate = playbackRate;
        }


        if( loop ){
            video.setAttribute( 'loop', '');
        }

        if( chapters ){
            chaptersData = [],
            totalLoadedTime = video.buffered.length ? video.buffered.end( video.buffered.length - 1 ) : 0;

            for( i = 0; i < chapters.length; i++){
                var width = ( ( this.convertToSeconds( chapters[ i ].endTime ) - this.convertToSeconds( chapters[ i ].startTime )  ) / video.duration * 100 ).toFixed(2),
                loadedTime;

                if( totalLoadedTime > chapters[ i ].endTime ){
                    loadedTime = 100;
                }else if( totalLoadedTime <  chapters[ i ].startTime ){
                    loadedTime = 0;
                }
                else{  
                    loadedTime =  ( totalLoadedTime - chapters[i].startTime ) / (chapters[i].endTime - chapters[i].startTime )* 100;
                    loadedTime = loadedTime > 100 ? 100 : loadedTime;                       
                }

                chaptersData.push( { title :  chapters[ i ].title, startTime : this.convertToSeconds( chapters[ i ].startTime ) , endTime : this.convertToSeconds( chapters[ i ].endTime ), width : width, time : 0, loadedTime : loadedTime } )    
            }
            if( chaptersData.length > 0 ){
                this.classHandler( this.$node.querySelector(".lyteVideoProgressBar"), "add", "lyteVideoBgTransparent" );
            }
            this.setData('chaptersData',chaptersData)
        }
        
        if( this._menu ){
            this._menu.style.right = "70px";
        }
        this.setData( "ltPropCurrentTime", -1 );
    },

    playBackRate : function( change ){
        var video = this._video;

        video.playbackRate = change.newValue;
    }.observes( 'ltPropPlayRate' ),

    qualityChange :  function( change ){
        if( !this._video ){
            return;
        }
        var video = this._video,
        source = video.querySelector('source'),
        curTime = video.currentTime,
        isPaused = video.paused,
        sources = this.data.ltPropSource,
        newValue = change ? change.newValue : this.data.ltPropQuality,
        i;

        if( newValue == "auto" ){
            return
        }
        for( i = 0; i < sources.length; i++){
            if( sources[i].size == newValue ){
                break;
            }
        }
        this.setData( "selectedSource", i );
        if( this.data.ltPropPrefetch && !sources[ i ].src.includes( "blob:" ) ){
            this.drawImage( undefined, 'black' );
            this.setData( "renderPrefetch", true );
            this._curTime = curTime;
            this._isPaused = isPaused;
            this.__preloaded = false;
            this.prefetch();
            return;

        }
        for( attr in sources[i] ){
            source.setAttribute(attr, sources[i][attr] );
        }

        video.load();

        var fn = function(){ 
            video.currentTime = curTime;
            if( isPaused ){
                this.pause();
            }else{
                this.play();
            }
            video.removeEventListener('canplay',fn);
        }.bind(this);

        video.addEventListener('canplay', fn );

    }.observes( 'ltPropQuality' ).on( 'didConnect' ),

    setSubtitle : function( change ){
        if( !this._video ){
            return;
        }
        var video = this._video,
        tracks = this.data.ltPropTracks,
        source = video.querySelector('track'),
        capDiv = this.$node.querySelector( '.lyteVideoSubtitleWrapper'),
        subtitles = [],
        newValue = change ? change.newValue : this.data.ltPropCaption,
        track, i;
        
        if( newValue === 'off' && capDiv){
            this.classHandler( capDiv, "add", "lyteVideoMenuHide" );
            return;
        }else if( newValue === 'off'){
            return;
        }
        else if( capDiv ){
            this.classHandler( capDiv, "remove", "lyteVideoMenuHide" );
        }

        for( i = 0; i < tracks.length; i++){
            if( tracks[i].label == newValue  || tracks[i].lang == newValue){
                break;
            }
        }
        
        for( attr in tracks[i] ){
            source.setAttribute( attr, tracks[i][ attr ]);
        }
        track = video.textTracks[ 0 ];
        track.mode = "hidden";
        
        if(  tracks && !('src' in tracks[ i ] ) ){
            subtitles = tracks [ i ].texts.slice();
            this.setData( 'subtitles', subtitles );
            return;
        }
        setTimeout( function(){
            for( j = 0; j < track.cues.length;j++){
                subtitles.push({ 'startTime' : track.cues[ j ].startTime, 'endTime' : track.cues[ j ].endTime, 'text' : track.cues[ j ].text } )
            }
            this.setData( 'subtitles', subtitles );
        }.bind( this ),500);
        
    }.observes( 'ltPropCaption' ).on( 'didConnect' ),

    setVolume : function( change ){
        if( this._video == undefined){
            return
        }
        var video = this._video;
        if( this._slider.ltProp('value')[0].value != change.newValue ){
            Lyte.objectUtils( this.data.sliderData[0], "add", "value", change.newValue );
            this._slider && this._slider.reRender && this._slider.reRender();
        }
        if( this.data.renderPrefetch ){
            this._volume = change.newValue;
        }else{
            if( change.newValue === 0 ){
                video.muted = true;
            }
            if( change.newValue === undefined ){
                video.volume = 1;
            }else{
                video.volume = change.newValue;
            }
        }
    }.observes( 'ltPropVolume' ),

    loop : function( change ){
        var video = this._video;
        if( change.newValue ){
            video.setAttribute('loop','');
        }else{
            video.removeAttribute( 'loop' );
        }
    }.observes( 'ltPropLoop'),

    source : function( change ){
        var video = this._video,
        isPaused = video.paused;
        this.setData( "selectedSource", 0 );
        this.data.metaSetted = false;
        video.load();
        var fn = function(){ 
            if( !isPaused ){
                this.play();
            }
            video.removeEventListener('canplay',fn);
        }.bind(this);

        video.addEventListener('canplay', fn );
    }.observes( 'ltPropSource'),

    time : function( change ){
        var video = this._video;
        if( change.newValue === undefined ){
            video.currentTime = 0;
            this.setData({
                elapsedTime : 0,
                initialLoad : true,
                hidePoster  : false
            })
            this.setData( "ltPropCurrentTime", -1 );
        }else if( change.newValue != -1 ){
            video.currentTime = change.newValue;
            if( change.newValue === 0 ){
                this.setData({
                    elapsedTime : 0,
                    initialLoad : true,
                    hidePoster  : false
                })
            }
            this.setData( "ltPropCurrentTime", -1 );
        }
    }.observes( 'ltPropCurrentTime'),

    autoPlay : function( change ){
        var video = this._video;

        if( change.newValue ){
            video.setAttribute( 'autoplay', '');
        }else{
            video.removeAttribute( 'autoplay');
        }
    }.observes( 'ltPropAutoPlay'),

    muteObserves : function( change ){
        var video = this._video;
        if( this.data.renderPrefetch ){
            this.handlePreVolume( "mute" );
            return;
        }
        video.muted = change.newValue;
    }.observes('ltPropMuted'),

    posterObserves : function( change ){
        const poster = change.newValue;
        if( poster && isNaN( poster ) ){
            this.getImage( poster )
        }else if( poster && !isNaN( poster ) ){
            this.drawImage( poster, true );
        }else{
            this.drawImage( undefined, 'black' );
        }
    }.observes( 'ltPropPoster' ),
    
    optionsObserves : function( change ){
        if( this.data.ltPropOptions.pip === false ){
            this._video.setAttribute("disablePictureInPicture","");
        }else{
            this._video.removeAttribute("disablePictureInPicture");
        }
    }.observes( 'ltPropOptions.pip').on("didConnect"), 
    menuListener : function( evt, fl ){
        if( !this._menu ){
            return
        }
        var flag = true,
        classList = ['lyteVideoSettingsWrapper', 'lyteVideoSettingsItem','lyteVideoSettingsIcon', 'lyteVideoSettingsLabel','lyteVideoSettingsKey','lyteVideoSettings', 'lyteVideoSettingsDropdownHead', 'lyteVideoSettingsBackIcon' ],
        menu = this._menu;

        if( evt ){
            for( i = 0; i < classList.length; i++){
                if( evt.target.classList.contains( classList[ i ] )){
                    flag = false;
                }
            }
        }
        if( flag  || fl ) {
            this.classHandler( menu, "add", "lyteVideoMenuHide" );
            this.classHandler( menu, "add", "lyteVideoSettingsItemHover" );
            menu.style = ''
            // menu.style.bottom = '70px';
            menu.style.right = "70px";
            this.setData({'subMenuOpened' : false, 'selectedOption' : 'settings'});
            this._menuIdx = 0;
            document.removeEventListener('scroll',this._onScroll);
            document.removeEventListener('click', this._menuListener);
            window.removeEventListener('resize',this._onResize);
            delete this._menuListener, this._onScroll, this._onResize;
        }
    },

    onScroll : function( evt ){
        if( this._menu ){
            return;
        }
        var menu = this._menu,
        bcr = menu.getBoundingClientRect();
        if( bcr.top < 0){
            menu.style.bottom = null;
            menu.style.top = this.$node.clientHeight + 'px';
        }else if(bcr.top - 70 > bcr.height ){
            menu.style.bottom = '70px';
            menu.style.top = null;
        }
    },

    onResize : function(){
        this.onScroll();
    },

    left : function(){
        return _lyteUiUtils.getRTL() ? "right" : "left";
    },

    bind_evt : function( fn, isTch ){
        document[ fn ]( isTch ? 'touchmove' : 'mousemove', this._move, true );
        document[ fn ]( isTch ? 'touchend' : 'mouseup', this._up, true );
    },

    updateTime : function( evt, flag){

        var ele = this._controls.querySelector(".lyteVideoProgressBar"),
        video = this._video,
        bcr = ele.getBoundingClientRect(),
        width = bcr.width,
        x = Math.min( Math.max( bcr.left, evt.clientX ), bcr.right ),
        diff = Math.min( Math.abs( x - bcr.left ), width ),
		duration = this.data.durationSec,
        time = Math.max( 0, Math.min( duration - 0.9, ( duration * ( diff / width ) ).toFixed( 2 ) ) ),
        hanlder = this._handler;
        
        if( flag || this.data.renderPrefetch ){
            return time;
        }


        video.currentTime = time;
        
        if( this._mouseDown ){
           var left = ( time / duration * 100) ;
           left = left > 100 ? 100 : left ;
           hanlder.style.left = left + '%';
        }

    },

    progressMouseMove : function( evt ){
        var touches = evt.touches || [],
		length = touches.length,
		ev = touches[ 0 ] || evt;

		if( length > 1 ){
			return;
		}
        
        if( length ){
            evt.preventDefault();
        }

        var time  = this.updateTime( ev );
        if( this.data.renderPrefetch ){
            this._isPaused = true;
            this._time = time;
            this.prefetch();
        }
    },

    progressMouseUp : function( evt ){
        var isTch = evt.touches ? true : false;

        this.bind_evt( 'removeEventListener', isTch );
        if( this._paused ){
            this.play();
        }

        delete this._move;
		delete this._up;
        delete this._paused;
        delete this._mouseDown;
    },

    play : function(){
        if( this._video == undefined){
            return
        }

        var video = this._video,
        _this = this,
        fn = function(){
            delete _this._happening;
            var final = _this._final;

            if( final ){
                delete _this._final;
                _this[ final ]();
            }
        };
        this.setData( "hidePoster", true );

        if( this._happening ){
            this._final = 'play';
        }else if( video.paused ){
            this._happening = true;
            video.play().then( fn ).catch( fn );
        }
    },

    pause : function(){
        if( this._video == undefined){
            return
        }
        var video = this._video;

        if( this._happening ){
			this._final = 'pause';
		} else {
			video.pause();
		}
    },

    getImage : function( url ){
        var img = new Image(),
        canvas = this.$node.querySelector( '.lyteVideoPoster' ),
        ctx = canvas.getContext( "2d" ),
        video = this._video,
        that = this;
        
        ctx.canvas.width = that.$node.clientWidth;
        ctx.canvas.height = that.$node.clientHeight;
        
        img.onload = function( ){
            ctx.drawImage( img , 0, 0, that.$node.clientWidth, that.$node.clientHeight);
        }

        img.src = url;
    },

    drawImage : function( time, fl ){
        var that = this,
        canvas =  fl ? this.$node.querySelector( '.lyteVideoPoster' ) : '',
        ctx = canvas.getContext( '2d' );
        
        if( fl == "black" ){
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return;
        }
        var video = this._video ?  this._video.cloneNode( true ) : '';
        video.currentTime = time;

        video.oncanplaythrough =  function(){
            ctx.canvas.width = that.$node.clientWidth;
            ctx.canvas.height = that.$node.clientHeight;


            createImageBitmap(video).then(function(frame) {
                ctx.drawImage(frame, 0, 0, that.$node.clientWidth, that.$node.clientHeight );
            }).catch( function( error ){
                // console.log( error );
            });
        }
    },

    prefetch : function(){
		var __fetch = window.fetch,
		__this = this,
		__data = __this.data,
		ns = 'prefetchLoading',
		__ns = 'lyteVideoPrefetch',
		renderPrefetch = 'renderPrefetch',
		__error = function( err ){
			__this.setData( ns, __ns + "Error" );

			var cb = "onPrefetchError";
			
			if( __this.getMethods( cb ) && __this.executeMethod( cb, err, __this.$node ) == false ){
				return;
			}

			if( /Access\-Control\-Allow\-Origin/i.test( err.message || "" ) ){
				this.setData( renderPrefetch, false );
			}

		},
		src = __data.ltPropSource[ __data.selectedSource ] || {};

		if( __this.__preloaded ){
			return;
		}

		if( __fetch ){

			var cb = "onBeforePrefetch";

			if( __this.getMethods( cb ) && __this.executeMethod( cb, __this.$node ) == false ){
				return;
			}

			__this.setData( ns, __ns + 'Loading' );
            __this.setData( "hidePoster", false );
			__fetch( src.src || "", __data.ltPropPrefetchOptions ).then( function( res ){
				if( /^2..$/.test( res.status ) ){
					return res.blob();
				} else {
					__error( {} );
				}
			}).then( function( blob ){
				
				__this.setData( ns, __ns + 'Success' );

				var __url = URL.createObjectURL( blob ),
				cb = "onPrefetchSuccess";
				
				Lyte.objectUtils( src, 'add', 'src', __url );
				__this.getMethods( cb ) && __this.executeMethod( cb, __url, __this.$node );
				__this.setData( renderPrefetch, !( __this.__preloaded = true ) );
                __this.setGlobals();
			}).then( function(){

                if( !__this._isPaused ){
                    __this.play();
                }
                if( __this._time ){
                    __this.setData( "hidePoster", true );
                    __this._video.currentTime = __this._time;
                }
                if( __this._curTime ){
                    __this._video.currentTime = __this._curTime;
                    __this.setData( "hidePoster", true );
                }
                if( __this._volume ){
                    __this._video.volume = __this._volume;
                    Lyte.objectUtils( __this.data.sliderData[0], "add", "value", __this._volume );
                }
                if( __this._muted ){
                    __this._video.muted = __this._muted;
                }
                delete __this._isPaused;
                delete __this._time;
                delete __this._curTime;
                delete __this._volume;
                delete __this._muted;
            }).catch( __error );
		}
	},

    handlePreVolume : function( currentValue ){
        var volIcon = this.$node.querySelector(".lyteVideoVolumeIcon");
        if( currentValue == "mute" ){
            this._muted = !this._muted;
            this._volume = this._volume == undefined ? 1 : this._volume; 
            if( this._muted ){
                this.classHandler( volIcon, "add", "lyteVideoMuted" );
                Lyte.objectUtils( this.data.sliderData[0], "add", "value", 0 );
            }else{
                this.classHandler( volIcon, "remove", "lyteVideoMuted" );
                Lyte.objectUtils( this.data.sliderData[0], "add", "value", this._volume );
            }
            this._slider && this._slider.reRender && this._slider.reRender();
            return;
        }
        if( this.data.renderPrefetch ){
            this._volume = currentValue.value;
            if( currentValue.value == 0 ){
                this.classHandler( volIcon, "add", "lyteVideoMuted" );
            }else if( currentValue.value < 0.5) {
                this.classHandler( volIcon, "remove", "lyteVideoMuted" );
                this.classHandler( volIcon, "add", "lyteVideoLow" );
            }else{
                this.classHandler( volIcon, "remove", "lyteVideoLow" );
            }
        }
    },
    handleMenuKeyDown : function( decrement, evt ){
        var menu = this._menu;
        if( menu && !menu.classList.contains('lyteVideoMenuHide')){
            this.classHandler( menu, "remove", "lyteVideoSettingsItemHover" );
            evt.preventDefault();
            var options = menu.children;
            this._menuIdx = this._menuIdx == 0 ? options.length  : this._menuIdx;
            
            prev =  Math.abs( this._menuIdx % options.length ),
            idx =  Math.abs( ( decrement ? --this._menuIdx : ++this._menuIdx ) % options.length );

            this.classHandler( options[ prev ], "remove", "lyteVideoSettingsItemSelected" );
            menu.scrollTop =  options[ idx ].offsetTop;
            this.classHandler( options[ idx ], "add", "lyteVideoSettingsItemSelected" );
            options[idx].focus();
        }
    },
    toggleFullScreen : function( ele ){
        var videoContainer = this.$node.querySelector('.lyteVideoContainer'),
        ele = ele ? ele : this.$node.querySelector('.lyteVideoFullScreen'),
        options = this.data.ltPropOptions,
        that = this;
        if( options && options.fullScreen === false ){
            return
        }
        if( document.fullscreenElement || document.webkitFullscreenElement){               
            document.fullscreenElement ? document.exitFullscreen() : document.webkitExitFullscreen();
            this.classHandler( ele, "remove", "lyteVideoFullScreenExit" );
        }else{
            var fn = videoContainer.requestFullscreen ? 'requestFullscreen' : 'webkitRequestFullscreen' ;
            videoContainer[ fn ]().then( function(){
                that.classHandler( ele, "add", "lyteVideoFullScreenExit" );
                if( navigator.maxTouchPoints ){
                    screen.orientation.lock('landscape').catch( function( error ){ });
                }
            }).catch( function(error){
                console.log( error)
            });
            
        }
    },
    actions : {
        keyDown : function( evt ){
            if( !this._video ){
                return
            }
            var video = this._video,
            wrapperEle,
            i = 0;
            if( this._focused ){  
                switch( evt.keyCode ){
                    case 70 :
                        this.toggleFullScreen();
                        break; 
                    case 75 :
                        if( video.paused ){
                            this.play();
                        }else{
                            this.pause();
                        }
                        break;
                    case 77 :
                        video.muted = !video.muted;
                        break;
                    case 9 : 
                        var menu = this._menu;
                        if( menu && !menu.classList.contains('lyteVideoMenuHide')){
                            this.handleMenuKeyDown( evt.shiftKey, evt );
                        }
                        break;
                    case 27 : 
                        var menu = this._menu;
                        if( menu && !menu.classList.contains('lyteVideoMenuHide')){
                            this.menuListener(null, true);
                            // this.handleMenuKeyDown( evt.shiftKey, evt );
                        }
                        break;
                    case 32 : 
                        evt.preventDefault();
                        if( this.data.renderPrefetch ){
                            this.prefetch();
                            return;
                        }
                        wrapperEle = this._animationWrapper[1];
                        iconEle = wrapperEle.children[0];
                        if( video.paused ){
                            this.classHandler( iconEle, "remove", "lyteVideoAnimatePauseIcon" );
                            this.classHandler( iconEle, "add", "lyteVideoAnimatePlayIcon" );
                            this.play();
                        }else{
                            this.classHandler( iconEle, "add", "lyteVideoAnimatePauseIcon" );
                            this.classHandler( iconEle, "remove", "lyteVideoAnimatePlayIcon" );
                            this.pause();
                        }
                        break;
                    case 39 :
                        if( !evt.target.classList.contains("lyteSliderHandler") ){
                            evt.preventDefault();
                            wrapperEle = this._animationWrapper[2];
                            video.currentTime += 10;
                        }
                        break;
                    case 37 :
                        if( !evt.target.classList.contains("lyteSliderHandler") ){
                            evt.preventDefault();
                            wrapperEle = this._animationWrapper[0];
                            video.currentTime -= 10;
                        }
                        break;
                    case 38 :
                        this.handleMenuKeyDown( true, evt );
                        break;
                    case 40 :
                        this.handleMenuKeyDown( false, evt );
                        break;
                    case 13 :
                        var menu = this._menu;
                        if( menu && !menu.classList.contains('lyteVideoMenuHide')){
                            var options = menu.children,
                            idx = Math.abs( this._menuIdx % options.length );
                            
                            options[ idx ].click();
                        }else{
                            document.activeElement.click();
                        }
                        evt.preventDefault();
                        break;
                }
                if( wrapperEle ){
                    wrapperEle.classList.add('lyteVideoAnimate');
                    setTimeout( function(){ wrapperEle.classList.remove('lyteVideoAnimate')}.bind(this),500);
                }
            }
        },
        play : function( evt ){
            if( !this.data.hidePoster ){
                this.setData( "hidePoster", true );
            }
            this.classHandler( this._playIcon, "remove", "lyteVideoPaused" );
            this.setData( "videoStatus",  _lyteUiUtils.i18n( "lyte.video.pause" ) );
            if ( this.getMethods('onPlay') ){
                const flag =  this.executeMethod( 'onPlay', this._video, evt, this.$node);
                if( flag === false ){
                    this.pause();
                }
            } 
        },

        pause : function( evt ){
            this.classHandler( this._playIcon, "add", "lyteVideoPaused" );
            this.setData( "videoStatus",  _lyteUiUtils.i18n( "lyte.video.play" ) );
            if( this.getMethods('onPause') ){
                const flag = this.executeMethod( 'onPause', this._video, evt, this.$node);
                if( flag === false ){
                    this.play();
                }
            }
        },

        togglePlayPause : function( ){
            var video = this._video,
            fn = "pause";

            if( video.paused ){
                fn = "play"
            }

            this[ fn ]();
            
        },

        prefetch : function(){
            if( this.data.ltPropPrefetch ){
                this.setData( "renderPrefetch", true );
                this.prefetch();
            }
        },

        clickOnVideo : function(){
            if( this.data.renderPrefetch ){
                this.prefetch();
                return;
            }
            
            var video = this._video,
            iconEle = this._animationWrapper[1].children[0];
            if( document.pictureInPictureElement == video){
                document.exitPictureInPicture();
            }else if( video.paused ){
                this.classHandler( iconEle, "remove", "lyteVideoAnimatePauseIcon" );
                this.classHandler( iconEle, "add", "lyteVideoAnimatePlayIcon" );
                this.play();
            }else{
                this.classHandler( iconEle, "add", "lyteVideoAnimatePauseIcon" );
                this.classHandler( iconEle, "remove", "lyteVideoAnimatePlayIcon" );
                this.pause();
            }
            this.classHandler( this._animationWrapper[ 1 ], "add", "lyteVideoAnimate" );
            setTimeout( function(){ this.classHandler( this._animationWrapper[ 1 ], "remove", "lyteVideoAnimate" );}.bind(this),500);
        },

        skipVideo : function( type ){
            var video = this._video,
            currrentTime = video.currentTime;
            if( type === 'forward' && this.data.forwardStatus != "" ){
                return;
            }else if( type === 'rewind' && this.data.backwardStatus != '' ){
                return
            }
            video.currentTime = currrentTime + ( type == 'forward' ? 10 : -10 );
        },

        mute : function(){
            var video = this._video;
            if( this.data.renderPrefetch ){
                this.handlePreVolume( "mute" );
                return;
            }
            video.muted = !video.muted;
        },

        changeVolume : function(){
            if( this._video == undefined){
                return
            }
            var video = this._video,
            volIcon = this.$node.querySelector(".lyteVideoVolumeIcon");

            if(video.volume < 0.5) {
                this.classHandler( volIcon, "add", "lyteVideoLow" );
            }else{
                this.classHandler( volIcon, "remove", "lyteVideoLow" );
            }

            if( video.volume > 0 && volIcon && volIcon.classList.contains('lyteVideoMuted')){
                this.classHandler( volIcon, "remove", "lyteVideoMuted" );
                video.muted = false;
                Lyte.objectUtils( this.data.sliderData[0], "add", "value", video.volume )
                this.setData( { 
                    "volumeStatus" : _lyteUiUtils.i18n( "lyte.video.volume.mute" )
                });
            }else if( !video.muted && video.volume == 0){
                Lyte.objectUtils( this.data.sliderData[0], "add", "value", 1 )
                this.setData({ 'ltPropVolume' : 1});
            }else if( video.muted ){
                this.classHandler( volIcon, "add", "lyteVideoMuted" );
                this.classHandler( volIcon, "remove", "lyteVideoLow" );
                Lyte.objectUtils( this.data.sliderData[0], "add", "value", 0 );

                this.setData( { 
                    'volumeStatus' : _lyteUiUtils.i18n( "lyte.video.volume.unmute" )
                });
            }
            this._slider && this._slider.reRender && this._slider.reRender();
        },

        update : function( evt ){
            if( this._video == undefined){
                return
            }
            var video = this._video,
            time = video.currentTime,
            duration = video.duration,
            chaptersData = this.getData( 'chaptersData' ),
            subtitles = this.getData( 'subtitles' ),
            subEle = this.$node.querySelector( '.lyteVideoSubtitle'),
            curTime;
            
            
            if( subtitles ){
                for( i = 0; i < subtitles.length; i++){
                    if( time >= subtitles[ i ].startTime && time <= subtitles[ i ].endTime && subEle.innerHTML == ''){
                        this.setData('subText', subtitles[ i ].text);
                        this._subIdx = i;
                    }
                }
                if( time <= subtitles[ this._subIdx ].startTime  || time >= subtitles[ this._subIdx ].endTime) {
                    this.setData('subText', '');
                }
            }

            if( chaptersData ){
                for( i = 0; i < chaptersData.length; i++){
                    if( time > chaptersData[i].endTime){
                        curTime = 100;
                    }else if( time <  chaptersData[i].startTime ){
                        curTime = 0;
                    }
                    else{  
                        curTime =  ( time - chaptersData[i].startTime) / (chaptersData[i].endTime - chaptersData[i].startTime )* 100;

                        curTime = curTime > 100 ? 100 : curTime;
                        this._curChapter = chaptersData[i].title;
                    }     
                    Lyte.objectUtils( chaptersData[i] , "add" , "time", curTime );
                }
            }
            
            this.setData( { 'currentDuration' : this.formatTime( time ), 'elapsedTime' : ( time / duration * 100) });
            this._handler.style.left = ( time / duration * 100) + '%';
            if( time > 10 ){
                this.setData( "backwardStatus", "" );
            }else{
                this.setData( "backwardStatus", "lyteVideoIconDisabled" );
            }
            if( ( duration - time ) < 10 ){
                this.setData( "forwardStatus", "lyteVideoIconDisabled" );
            }else{
                this.setData( "forwardStatus", "" );
            } 

            this.getMethods('onProgress') && this.executeMethod( 'onProgress', this._video, time, evt, this.$node);               
        },

        meta : function(){
            if( this._video == undefined){
                return
            }

            var video = this._video,
            duration = video.duration;
            if( !this.data.metaSetted )
            {
                this.setData({ 
                    'metaSetted' :  true ,
                    'duration' : this.formatTime( duration ),
                    'durationSec' : duration
                })
                this.setDefault();
            }
            this.getMethods('onMetaLoaded') && this.executeMethod( 'onMetaLoaded', this.$node, {
                height : video.videoHeight,
                width : video.videoWidth,
                duration : video.duration
            } );
        },

        togglePip : function(){
			if (!('pictureInPictureEnabled' in document)) {
			    console.warn("Picture-in-picture is not supported");
			    return;
			}
            var video = this._video;
            if( video !== document.pictureInPictureElement ){

                video.requestPictureInPicture().then( function(){
                    this.classHandler( this._controls, "remove", "lyteVideoControlsShow" );
                }.bind(this)).catch(function(error){ 
                    console.log(error);
                });
            }else{
                document.exitPictureInPicture();
            }

		},

        toggleMiniMode : function( flag ){
            const miniContainer = this.$node.querySelector( ".lyteVideoMiniContainer" );
            const miniMode = this.data.miniMode;
            if( miniMode ){
                _lyteUiUtils.appendChild( this._container, this._video );
                _lyteUiUtils.appendChild( this._container, this._controls );
            }else{
                _lyteUiUtils.appendChild( miniContainer, this._video );
                _lyteUiUtils.appendChild( miniContainer, this._controls );
            }
            if( flag ){
                this.pause();
            }
            this.setData( "miniMode", !this.data.miniMode );
        },
        toggleFullScreen : function( ele ){
            this.toggleFullScreen( ele );
        },

        toggleSettings : function(){
            var menu = this._menu,
            diff,bcr;

            if( menu && menu.classList.contains('lyteVideoMenuHide')){
                
                menu.classList.remove('lyteVideoMenuHide');

                this._menuListener = this.menuListener.bind( this );
                document.addEventListener('click', this._menuListener);
                menu.focus();

            }else{
                this.menuListener(null, true);
            }
        },

        mouseMove : function( evt, ele ){
            var container = this.data.miniMode ? ele : this._container;
            if( evt.pointerType != 'touch' && document.pictureInPictureElement == null ){
                clearTimeout( this._timerIdx );
                this.classHandler( container , "add", "lyteVideoControlsShow" );
                var flag = this._menu ? this._menu.classList.contains('lyteVideoMenuHide') : true;
                if( flag  &&  this._video && !this._video.paused){
                    this._timerIdx =  setTimeout(  function(){ 
                        this.classHandler( container , "remove", "lyteVideoControlsShow" );
                    }.bind(this), 3000 );
                }
            }
        },

        mouseEnter : function( evt, ele ){
            this._focused = true;
            var container = this.data.miniMode ? ele : this._container,
            flag = this._menu ? this._menu.classList.contains('lyteVideoMenuHide') : true;
            if( document.pictureInPictureElement == null ){
                this.classHandler( container, "add", "lyteVideoControlsShow" );
            }
            if( evt.pointerType == 'touch' && flag){
                clearTimeout( this._timerIdx );
                this._timerIdx =  setTimeout(  function(){ 
                    this.classHandler( container, "remove", "lyteVideoControlsShow" );
                }.bind(this), 3000 );
            }
        },

        mouseLeave : function( evt, ele ){
            this._focused = false;
            var container = this.data.miniMode ? ele : this._container,
            flag = this._menu ? this._menu.classList.contains('lyteVideoMenuHide') : true;
            if( evt.pointerType != 'touch' && flag && this._video && !this._video.paused){
                this.classHandler( container , "remove", "lyteVideoControlsShow" );
            }
        },

        mouseOver : function(){
            var menu = this._menu;
            if( menu && !menu.classList.contains('lyteVideoSettingsItemHover')){
                var options = menu.children,
                idx = Math.abs( this._menuIdx % options.length);
                this.classHandler( options[ idx ], "remove", "lyteVideoSettingsItemSelected" );
                this.classHandler( this._menu, "add", "lyteVideoSettingsItemHover" );
            }
        },

        settingsMenuClick : function( ele ){
            var value = ele.getAttribute('data-value'),
            menu = this._menu,
            bck = this.getMethods('onMenuClick') && this.executeMethod( 'onMenuClick', value, menu );
            bck = ( bck == undefined ) ? true : bck;
            
            if( !menu ){
                return;
            }
            if( !bck ){
                this.classHandler( menu, "add", "lyteVideoMenuHide" );
                this.setData({'subMenuOpened' : false, 'selectedOption' : 'settings'});
                return;
            }

            if( value == "back" ){
                this.classHandler( menu, "add", "lyteVideoMenuHide" );
                this.setData({'subMenuOpened' : false, 'selectedOption' : 'settings'});
                this.classHandler( menu, "remove", "lyteVideoMenuHide" );
            }else if( this.data.selectedOption == "settings"){
                this.setData({'subMenuOpened' : true, 'selectedOption' : value });
                this.classHandler( menu, "remove", "lyteVideoMenuHide" );
            }else {
                if( this.data.selectedOption === "playBackSpeed" ){
                    this.setData( 'ltPropPlayRate', value );
                }else if( this.data.selectedOption === "qualityOption" ){
                    this.setData('ltPropQuality', value );
                }else if( this.data.selectedOption === "subtitles" ){
                    this.setData( 'ltPropCaption', value );
                }
                this.classHandler( menu, "add", "lyteVideoMenuHide" );
                this.setData({'subMenuOpened' : false, 'selectedOption' : 'settings'});
            }
            menu.focus();
        },

        progress : function( evt ){
            if( this._video == undefined){
                return
            }
            var video = this._video,
            buffer = video.buffered,
            duration = video.duration,
            chaptersData = this.getData( 'chaptersData' ),
            totalLoadedTime, width, loadedTime;

            if( buffer.length ){ 
                totalLoadedTime = buffer.end( buffer.length - 1 );    
                width = totalLoadedTime / duration * 100;
            } 

            if( chaptersData  && totalLoadedTime ){

                for( i = 0; i < chaptersData.length; i++){
                    if( totalLoadedTime > chaptersData[i].endTime){
                        loadedTime = 100;
                    }else if( totalLoadedTime <  chaptersData[i].startTime ){
                        loadedTime = 0;
                    }
                    else{  
                        loadedTime =  ( totalLoadedTime - chaptersData[i].startTime ) / (chaptersData[i].endTime - chaptersData[i].startTime )* 100;
                        loadedTime = loadedTime > 100 ? 100 : loadedTime;                       
                    }    

                    Lyte.objectUtils( chaptersData[i] , "add" , "loadedTime", loadedTime );
                }
            }

            this.setData( 'loadedTime', width)
        },

        progressClick : function( evt ){
            var ele = evt.target;

            if( ele.classList.contains('.lyteVideoProgressHandler') ){
                return;
            }

            var time = this.updateTime( evt );
            if( this.data.renderPrefetch ){
                this._isPaused = true;
                this._time = time;
                this.prefetch();
            }
        },

        progressMouseDown : function( evt ){
            var touches = evt.touches || [],
			length = touches.length,
			isTch = length != 0;

            if( length > 1 ){
				return;
			}

            if( this._video && !this._video.paused){
                this.pause();
                this._paused = true;
            }
            this._mouseDown = true;
            this._move = this.progressMouseMove.bind( this );
            this._up = this.progressMouseUp.bind( this );
            this.bind_evt( "addEventListener", isTch );
            evt.preventDefault();
        },

        chapterSelect : function( ele ){
            var video = this._video;
            
            video.currentTime = ele.getAttribute('data-start')
        },

        updateToolTip : function( evt ){
            if( this.data.miniMode ){
                return;
            }
            var time = this.updateTime( evt, true ),
            curChapter = this._curChapter ? this._curChapter : '',
            tooltip = this.$node.querySelector(".lyteVideoToolTip"),
            title = $L(evt.target).closest('.lyteVideoChapter').attr('data-label'),
            ele = this.$node.querySelector(".lyteVideoProgressBar"),
            bcr = ele.getBoundingClientRect(),
            op = {};
            
            title = title ? title : curChapter;
            tooltip.style.left = evt.clientX - bcr.left -  15  + "px";
            op.name = title;
            op.time = this.formatTime( time );

            this.setData('toolTip', op);
        },
        onCanPlay : function(){
            this.setData("canPlay", true );
            this.getMethods('onCanPlay') && this.executeMethod( 'onCanPlay', this.$node );
        },
        onWaiting : function( isBuffering ){
            let initialLoad = false;
            if( !this._video ){
                initialLoad = true;
            }else if(this._video.currentTime === 0){
                initialLoad = true;
            }
            this.setData( "initialLoad", initialLoad );
            this.setData("canPlay", isBuffering );
        }
    },

    methods : {
        setVolume : function( handlerIndex , currentValue ){
            if( this.data.renderPrefetch ){
                this.handlePreVolume( currentValue );
                return;
            }
            var video = this._video;
            if( this._video == undefined){
                return
            }
            if( currentValue.value == 0){
                video.muted = true;
            }
            
            this.setData('ltPropVolume',currentValue.value)
        }
        
    }
});

Lyte.Component.registerHelper( "lyteUiSetSelectedClass" , function( value, selectedVal ){
	if(value == selectedVal){
		return "lyteVideoOptionselected";
	}
	return "";
});
Lyte.Component.registerHelper( "getQualityI18n" , function( quality){
	if( quality === "auto" ){
        return _lyteUiUtils.i18n("lyte.video.menu.qualityOption.auto");
    }
	return quality;
});
/**
 * @syntax staticBuilder
 * <lyte-video lt-prop-source='[{"src":"https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4","type":"video/mp4","size":"480p"}]'></lyte-video> 
 */