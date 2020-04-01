<template>
  <b-row>
    <b-col cols="4">
      <video id="video" :src="guiState.video" preload="auto" type="video/mp4" playsinline ref="video"></video>
      <p>ReadyState: {{readyState}}<br>
      {{this.videoCurrentTime}} / {{this.videoDuration}}<br>
      <a v-if="recordVideo.blob != ''" :href="recordVideo.blob" ref="link" download="movie.webm">Download</a>
      </p>
    </b-col>
    <b-col cols="4">
      <canvas id="canvas" ref="canvas"></canvas>
      <!-- <p><pre>{{currentData}}</pre></p> -->
    </b-col>
    <b-col cols="2">

      <div class="statsBox" ref="statsBox" v-show="guiState.showFps"></div>

      <b-form-group label-size="sm" label="Video Source:">
        <b-form-select size="sm" v-model="guiState.video" :options="guiOptions.video" @change="onChangeVideoSrc"></b-form-select>
      </b-form-group>

      <b-form-group label-size="sm" label="Video Control:">
        <b-button variant="primary" size="sm" @click="play" :disabled="isPlaying">Play</b-button>
        <b-button variant="secondary" size="sm" @click="stop" :disabled="!isPlaying">Stop</b-button>
      </b-form-group>

      <b-form-group label-size="sm" :label="'playbackRate: ' + videoPlaybackRate">
        <b-form-input v-model="videoPlaybackRate" type="range" min="0.0" max="1.0" step="0.01"></b-form-input>
      </b-form-group>

      <div class="pt-2 pb-2">
        <b-form-checkbox size="md" v-model="enableVideoRecord" switch><small>EnableVideoRecorder</small></b-form-checkbox>
      </div>

      <div class="pt-2 pb-2">
        <b-form-checkbox size="md" v-model="enableDataRecord" switch><small>EnableDataRecorder</small></b-form-checkbox>
      </div>

      <b-form-group label-size="sm" label="Algorithm:">
        <b-form-select size="sm" v-model="guiState.algorithm" :options="guiOptions.algorithm"></b-form-select>
      </b-form-group>

      <b-form-group label-size="sm" label="Estimate:">
        <b-form-select size="sm" v-model="guiState.estimate" :options="guiOptions.estimate"></b-form-select>
      </b-form-group>

      <div class="pt-2 pb-2">
        <b-form-checkbox size="md" v-model="guiState.flipHorizontal" switch><small>FlipHorizontal</small></b-form-checkbox>
      </div>

      <div class="pt-2 pb-2">
        <b-form-checkbox size="md" v-model="guiState.showFps" switch><small>ShowFps</small></b-form-checkbox>
      </div>

    </b-col>
    <b-col cols="2">

      <div class="pb-2">
        <b-button size="sm" v-b-toggle.collapse-input block variant="light" class="text-left" aria-expanded="false" aria-controls="collapse-input">Input</b-button>
        <b-collapse id="collapse-input" class="p-3">

          <b-form-group label-size="sm" label="Architecture:">
            <b-form-select size="sm" v-model="guiState.input.architecture" :options="guiOptions.input.architecture"></b-form-select>
          </b-form-group>

          <b-form-group label-size="sm" label="OutputStride:">
            <b-form-select size="sm" v-model="guiState.input.outputStride" :options="guiOptions.input.outputStride"></b-form-select>
          </b-form-group>

          <b-form-group label-size="sm" label="InternalResolution:">
            <b-form-select size="sm" v-model="guiState.input.internalResolution" :options="guiOptions.input.internalResolution"></b-form-select>
          </b-form-group>

          <b-form-group label-size="sm" label="Multiplier:">
            <b-form-select size="sm" v-model="guiState.input.multiplier" :options="guiOptions.input.multiplier"></b-form-select>
          </b-form-group>

          <b-form-group label-size="sm" label="QuantBytes:">
            <b-form-select size="sm" v-model="guiState.input.quantBytes" :options="guiOptions.input.quantBytes"></b-form-select>
          </b-form-group>

        </b-collapse>
      </div>

      <div class="pb-2">
        <b-button size="sm" v-b-toggle.collapse-multiPersonDecoding block variant="light" class="text-left" aria-expanded="false" aria-controls="collapse-multiPersonDecoding">MultiPersonDecoding</b-button>
        <b-collapse id="collapse-multiPersonDecoding" class="p-3">

          <b-form-group label-size="sm" :label="'MaxDetections: ' + guiState.multiPersonDecoding.maxDetections">
            <b-form-input v-model="guiState.multiPersonDecoding.maxDetections" type="range" min="1" max="10"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'ScoreThreshold: ' + guiState.multiPersonDecoding.scoreThreshold">
            <b-form-input v-model="guiState.multiPersonDecoding.scoreThreshold" type="range" min="0.0" max="1.0" step="0.01"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'NmsRadius: ' + guiState.multiPersonDecoding.nmsRadius">
            <b-form-input v-model="guiState.multiPersonDecoding.nmsRadius" type="range" min="1" max="50"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'NumKeypointForMatching: ' + guiState.multiPersonDecoding.numKeypointForMatching">
            <b-form-input v-model="guiState.multiPersonDecoding.numKeypointForMatching" type="range" min="1" max="50"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'RefineSteps: ' + guiState.multiPersonDecoding.refineSteps">
            <b-form-input v-model="guiState.multiPersonDecoding.refineSteps" type="range" min="1" max="20"></b-form-input>
          </b-form-group>

        </b-collapse>
      </div>

      <div class="pb-2">
        <b-button size="sm" v-b-toggle.collapse-segmentation block variant="light" class="text-left" aria-expanded="false" aria-controls="collapse-segmentation">Segmentation</b-button>
        <b-collapse id="collapse-segmentation" class="p-3">

          <b-form-group label-size="sm" :label="'SegmentationThreshold: ' + guiState.segmentation.segmentationThreshold">
            <b-form-input v-model="guiState.segmentation.segmentationThreshold" type="range" min="0.0" max="1.0" step="0.01"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" label="Effect:">
            <b-form-select size="sm" v-model="guiState.segmentation.effect" :options="guiOptions.segmentation.effect"></b-form-select>
          </b-form-group>

          <div class="pt-2 pb-2">
            <b-form-checkbox size="md" v-model="guiState.segmentation.maskBackground" switch><small>MaskBackground</small></b-form-checkbox>
          </div>

          <b-form-group label-size="sm" :label="'Opacity: ' + guiState.segmentation.opacity">
            <b-form-input v-model="guiState.segmentation.opacity" type="range" min="0.0" max="1.0" step="0.01"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'BackgroundBlurAmount: ' + guiState.segmentation.backgroundBlurAmount">
            <b-form-input v-model="guiState.segmentation.backgroundBlurAmount" type="range" min="1" max="20"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'EdgeBlurAmount: ' + guiState.segmentation.edgeBlurAmount">
            <b-form-input v-model="guiState.segmentation.edgeBlurAmount" type="range" min="0" max="20"></b-form-input>
          </b-form-group>

        </b-collapse>
      </div>

      <div class="pb-2">
        <b-button size="sm" v-b-toggle.collapse-partMap block variant="light" class="text-left" aria-expanded="false" aria-controls="collapse-partMap">PartMap</b-button>
        <b-collapse id="collapse-partMap" class="p-3">

          <b-form-group label-size="sm" label="ColorScale:">
            <b-form-select size="sm" v-model="guiState.partMap.colorScale" :options="guiOptions.partMap.colorScale"></b-form-select>
          </b-form-group>

          <b-form-group label-size="sm" label="Effect:">
            <b-form-select size="sm" v-model="guiState.partMap.effect" :options="guiOptions.partMap.effect"></b-form-select>
          </b-form-group>

          <b-form-group label-size="sm" :label="'SegmentationThreshold: ' + guiState.partMap.segmentationThreshold">
            <b-form-input v-model="guiState.partMap.segmentationThreshold" type="range" min="0.0" max="1.0" step="0.01"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'Opacity: ' + guiState.partMap.opacity">
            <b-form-input v-model="guiState.partMap.opacity" type="range" min="0.0" max="1.0" step="0.01"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'blurBodyPartAmount: ' + guiState.partMap.blurBodyPartAmount">
            <b-form-input v-model="guiState.partMap.blurBodyPartAmount" type="range" min="1" max="20"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'bodyPartEdgeBlurAmount: ' + guiState.partMap.bodyPartEdgeBlurAmount">
            <b-form-input v-model="guiState.partMap.bodyPartEdgeBlurAmount" type="range" min="0" max="20"></b-form-input>
          </b-form-group>

        </b-collapse>
      </div>

      <b-form-group label-size="sm" label="Save Parameters:">
        <b-button variant="primary" size="sm" @click="saveLocalStorage">Save</b-button>
        <b-button variant="danger" size="sm" @click="deleteLocalStorage">Delete</b-button>
      </b-form-group>

    </b-col>
  </b-row>
</template>

<script>
import Vue from 'vue'
import SegmentMain from '../segment/SegmentMain'
import sleep from '../utils/Sleep'
import Utils from '../utils/Utils'

import * as partColorScales from './part_color_scales'
import dat from 'dat.gui'
import Stats from 'stats.js'

let Component = Vue.extend({

  data() {
    return {
      video: null,
      canvas: null,
      isPlaying: false,
      isCancelUpdate: false,
      videoFrameRate: 29.97,
      videoPlaybackRate: 0.5,
      readyState: 0,
      videoDuration: 0,
      videoCurrentTime: 0,
      currentData: {},
      recordData: [],
      enableDataRecord: false,
      recorder: null,
      recordVideo: {
        blob: ''
      },
      enableVideoRecord: false,
      state: {
        // Triggers the TensorFlow model to reload
        changingArchitecture: false,
        changingMultiplier: false,
        changingStride: false,
        changingResolution: false,
        changingQuantBytes: false
      },
      guiOptions: {
        video: ['/static/video/Exercise.mp4',
                '/static/video/Kettlebell.mp4',
                '/static/video/Shopping.mp4'],
        algorithm: ['multi-person-instance', 'person'],
        estimate: ['partmap','segmentation'],
        input: {
          architecture: ['ResNet50', 'MobileNetV1'],
          outputStride: [8, 16, 32],
          internalResolution: ['low', 'medium', 'high', 'full'],
          multiplier: [0.50, 0.75, 1.0],
          quantBytes: [1, 2, 4]
        },
        multiPersonDecoding: {
        },
        segmentation: {
          effect: ['mask', 'bokeh']
        },
        partMap: {
          colorScale: Object.keys(partColorScales),
          effect: ['partMap', 'pixelation', 'blurBodyPart']
        }
      },
      guiState: {
        video: '/static/video/Exercise.mp4',
        algorithm: 'person',
        estimate: 'segmentation',
        input: {
          architecture: 'ResNet50',
          outputStride: 16,
          internalResolution: 'medium',
          multiplier: 0.75,
          quantBytes: 2
        },
        multiPersonDecoding: {
          maxDetections: 5,
          scoreThreshold: 0.3,
          nmsRadius: 20,
          numKeypointForMatching: 17,
          refineSteps: 10
        },
        segmentation: {
          segmentationThreshold: 0.3,
          effect: 'mask',
          maskBackground: true,
          opacity: 0.7,
          backgroundBlurAmount: 3,
          maskBlurAmount: 0,
          edgeBlurAmount: 3
        },
        partMap: {
          colorScale: 'rainbow',
          effect: 'partMap',
          segmentationThreshold: 0.5,
          opacity: 0.9,
          blurBodyPartAmount: 3,
          bodyPartEdgeBlurAmount: 3
        },
        flipHorizontal: false,
        showFps: true
      }
    }
  },

  components: {
  },

  created() {
  },

  async mounted() {
    this.video = this.$refs.video
    this.canvas = this.$refs.canvas

    this.loadLocalStorage()
    this.setupFPS()

    this.video.addEventListener('seeked', (e) => {
      // console.log('seeked.')
    })

    try {
      this.video = await this.onLoadVideo(this.video)
    }
    catch (e) {
      throw e
    }

    this.setupRecord()

    this.segmentMain = new SegmentMain(this.video, this.canvas, this.state, this.guiState)
  },

  beforeDestroy() {
    this.isDestroyed = true
  },

  destroyed(){},

  computed: {
  },

  methods: {

    loadLocalStorage(){
      if (localStorage.getItem('segmentState')) {
        try {
          this.guiState = JSON.parse(localStorage.getItem('segmentState'))
        }
        catch(e) {
          localStorage.removeItem('segmentState')
        }
      }
    },

    saveLocalStorage() {
      const parsed = JSON.stringify(this.guiState)
      localStorage.setItem('segmentState', parsed)
    },

    deleteLocalStorage() {
      localStorage.removeItem('segmentState')
    },

    onLoadVideo(video){
      return new Promise((resolve) => {
        video.onloadeddata = (event) => {
          video.width = video.videoWidth
          video.height = video.videoHeight
          video.playbackRate = this.videoPlaybackRate

          this.totalFrame = video.duration * this.videoFrameRate
          console.log('readyState', video.readyState)
          resolve(video)
        }
      })
    },

    async onChangeVideoSrc(){
      try {
        this.video = await this.onLoadVideo(this.video)
      }
      catch (e) {
        throw e
      }
      this.segmentMain.changeVideo(this.video)
    },

    play(){
      // this.video.play()
      this.isPlaying = true

      this.updateStart()
      this.updateRecordStart()
    },

    stop(){
      this.video.pause()
      this.isPlaying = false
      this.video.currentTime = 0

      this.updateStop()
      this.updateRecordStop()
    },

    nextFrame(){
      let frameRate = 1 / this.videoFrameRate
      this.video.currentTime += frameRate * this.videoPlaybackRate
      this.videoCurrentTime = this.video.currentTime
      this.videoDuration = this.video.duration

      // console.log(this.video.currentTime, this.video.duration)

      if(this.video.currentTime > this.video.duration){
        this.video.currentTime = this.video.duration
        this.stop()
      }
    },

    setupFPS(){
      this.stats = new Stats()
      this.stats.showPanel(0)
      if(this.guiState.showFps) {
        let d = this.stats.dom
        d.style.position = 'fixed'
        d.style.left = 'auto'
        d.style.right = 0
        this.$refs.statsBox.appendChild(d)
      }
    },

    updateStart(){
      this.isCancelUpdate = false
      this.update()
    },

    updateStop(){
      this.isCancelUpdate = true
    },

    async update(){
      if(!this.isCancelUpdate){

        this.readyState = this.video.readyState

        if(this.readyState >= 4){
          this.stats.begin()

          let data = await this.segmentMain.update(this.state, this.guiState)
          this.updateRecord(data)
          this.nextFrame()
          // console.log('readyState', this.readyState)

          this.stats.end()
        }

        requestAnimationFrame(this.update)
      }
      else{
        cancelAnimationFrame(this.update)
      }
    },

    setupRecord(){
      let ctx = this.canvas.getContext('2d')
      var stream = canvas.captureStream()
      this.recorder = new MediaRecorder(stream, {mimeType:'video/webm;codecs=vp9'})

      let $link = this.$refs.link
      this.recorder.ondataavailable = (e)=>{
        let videoBlob = new Blob([e.data], { type: e.data.type })
        this.recordVideo.blob = window.URL.createObjectURL(videoBlob)
      }
    },

    updateRecordStart(){
      if(this.enableDataRecord){
        this.recordData = []
      }

      if(this.enableVideoRecord){
        this.recordVideo.blob = ''
        this.recorder.start()
      }
    },

    updateRecord(data){
      this.currentData = data

      if(this.enableDataRecord){
        this.recordData.push(data)
      }
    },

    updateRecordStop(){
      if(this.enableVideoRecord){
        this.recorder.stop()
      }
    }

  }

})

export default Component
</script>

<style scoped lang="css">
#video{
  width: 100%;
  height: auto;
}

#canvas{
  width: 100%;
  height: auto;
  background: #f6f6f6;
}

.statsBox{
}

button[aria-expanded]:before{
  font-family: "Ionicons";
  margin-right: 5px;
}

button[aria-expanded='false']:before {
  content: '\f3d0';
}

button[aria-expanded='true']:before {
  content: '\f3d8';
}
</style>
