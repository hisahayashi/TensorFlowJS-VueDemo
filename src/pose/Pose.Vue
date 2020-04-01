<template>
  <b-row>
    <b-col cols="4">
      <video id="video" :src="guiState.video" preload="auto" type="video/mp4" playsinline ref="video"></video>
      <p>
          ReadyState: {{readyState}}<br>
        {{this.videoCurrentTime}} / {{this.videoDuration}}<br>
        <a v-if="recordVideoBlob != ''" :href="recordVideoBlob" ref="link" download="movie.webm">Download</a><br>
      </p>
    </b-col>
    <b-col cols="4">
      <canvas id="canvas" ref="canvas"></canvas>
      <p>
        {{recordData.length}}<br>
        <a v-if="recordData.length > 0" :href="recordDataBlob" ref="link" download="data.json">Download</a><br>
        {{currentData}}</pre>
      </p>
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
            <b-form-select size="sm" v-model="guiState.input.inputResolution" :options="guiOptions.input.inputResolution"></b-form-select>
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
        <b-button size="sm" v-b-toggle.collapse-singlePoseDetection block variant="light" class="text-left" aria-expanded="false" aria-controls="collapse-singlePoseDetection">SinglePoseDetection</b-button>
        <b-collapse id="collapse-singlePoseDetection" class="p-3">

          <b-form-group label-size="sm" :label="'minPoseConfidence: ' + guiState.singlePoseDetection.minPoseConfidence">
            <b-form-input v-model="guiState.singlePoseDetection.minPoseConfidence" type="range" min="0.0" max="1.0" step="0.01"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'minPartConfidence: ' + guiState.singlePoseDetection.minPartConfidence">
            <b-form-input v-model="guiState.singlePoseDetection.minPartConfidence" type="range" min="0.0" max="1.0" step="0.01"></b-form-input>
          </b-form-group>

        </b-collapse>
      </div>

      <div class="pb-2">
        <b-button size="sm" v-b-toggle.collapse-multiPoseDetection block variant="light" class="text-left" aria-expanded="false" aria-controls="collapse-multiPoseDetection">MultiPoseDetection</b-button>
        <b-collapse id="collapse-multiPoseDetection" class="p-3">

          <b-form-group label-size="sm" :label="'maxPoseDetections: ' + guiState.multiPoseDetection.maxPoseDetections">
            <b-form-input v-model="guiState.multiPoseDetection.maxPoseDetections" type="range" min="1" max="20"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'minPoseConfidence: ' + guiState.multiPoseDetection.minPoseConfidence">
            <b-form-input v-model="guiState.multiPoseDetection.minPoseConfidence" type="range" min="0.0" max="1.0" step="0.01"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'minPartConfidence: ' + guiState.multiPoseDetection.minPartConfidence">
            <b-form-input v-model="guiState.multiPoseDetection.minPartConfidence" type="range" min="0.0" max="1.0" step="0.01"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" :label="'nmsRadius: ' + guiState.multiPoseDetection.nmsRadius">
            <!-- <b-form-input v-model="guiState.multiPoseDetection.nmsRadius" type="range" min="0" max="40"></b-form-input> -->
          </b-form-group>

        </b-collapse>
      </div>

      <div class="pb-2">
        <b-button size="sm" v-b-toggle.collapse-output block variant="light" class="text-left" aria-expanded="false" aria-controls="collapse-output">output</b-button>
        <b-collapse id="collapse-output" class="p-3">

          <div class="pt-2 pb-2">
            <b-form-checkbox size="md" v-model="guiState.output.showVideo" switch><small>showVideo</small></b-form-checkbox>
          </div>

          <div class="pt-2 pb-2">
            <b-form-checkbox size="md" v-model="guiState.output.showSkeleton" switch><small>showSkeleton</small></b-form-checkbox>
          </div>

          <div class="pt-2 pb-2">
            <b-form-checkbox size="md" v-model="guiState.output.showPoints" switch><small>showPoints</small></b-form-checkbox>
          </div>

          <div class="pt-2 pb-2">
            <b-form-checkbox size="md" v-model="guiState.output.showBoundingBox" switch><small>showBoundingBox</small></b-form-checkbox>
          </div>

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
import PoseMain from '../pose/PoseMain'
import sleep from '../utils/Sleep'
import Utils from '../utils/Utils'

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
      videoPlaybackRate: 0.1,
      readyState: 0,
      videoDuration: 0,
      videoCurrentTime: 0,

      currentData: {},
      recordData: [],
      recordDataBlob: {},
      enableDataRecord: false,
      recordDataCount: 0,

      recorder: null,
      recordVideo: {},
      recordVideoBlob: {},
      enableVideoRecord: false,

      guiOptions: {
        video: ['/static/video/Exercise.mp4',
                '/static/video/Kettlebell.mp4',
                '/static/video/Shopping.mp4'],
        algorithm: ['single-pose', 'multi-pose'],
        input: {
          architecture: ['ResNet50', 'MobileNetV1'],
          outputStride: [8, 16, 32],
          inputResolution: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800],
          multiplier: [0.50, 0.75, 1.0],
          quantBytes: [1, 2, 4]
        },
        singlePoseDetection: {},
        multiPoseDetection: {},
        output: {}
      },
      guiState: {
        video: '/static/video/Exercise.mp4',
        algorithm: 'multi-pose',
        input: {
          architecture: 'ResNet50',
          outputStride: 32,
          inputResolution: 250,
          multiplier: 1.0,
          quantBytes: 2
        },
        singlePoseDetection: {
          minPoseConfidence: 0.1,
          minPartConfidence: 0.5
        },
        multiPoseDetection: {
          maxPoseDetections: 5,
          minPoseConfidence: 0.15,
          minPartConfidence: 0.1,
          nmsRadius: 30.0
        },
        output: {
          showVideo: true,
          showSkeleton: true,
          showPoints: true,
          showBoundingBox: false
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

    this.poseMain = new PoseMain(this.video, this.canvas, this.guiState)
  },

  beforeDestroy() {
    this.isDestroyed = true
  },

  destroyed(){},

  computed: {
  },

  methods: {

    loadLocalStorage(){
      if (localStorage.getItem('poseState')) {
        try {
          this.guiState = JSON.parse(localStorage.getItem('poseState'))
        }
        catch(e) {
          localStorage.removeItem('poseState')
        }
      }
    },

    saveLocalStorage() {
      const parsed = JSON.stringify(this.guiState)
      localStorage.setItem('poseState', parsed)
    },

    deleteLocalStorage() {
      localStorage.removeItem('poseState')
    },

    onLoadVideo(video){
      return new Promise((resolve) => {
        video.onloadeddata = (event) => {
          video.width = video.videoWidth
          video.height = video.videoHeight

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
      this.poseMain.changeVideo(this.video)
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

          let data = await this.poseMain.update(this.guiState)
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
        let blob = new Blob([e.data], { type: e.data.type })
        this.recordVideoBlob = window.URL.createObjectURL(blob)
      }
    },

    updateRecordStart(){
      if(this.enableDataRecord){
        this.recordDataCount = 0
        this.recordDataBlob = {}
        this.recordData = []
      }

      if(this.enableVideoRecord){
        this.recordVideoBlob = {}
        this.recorder.start()
      }
    },

    updateRecord(data){
      this.currentData = data

      if(this.enableDataRecord){
        // this.recordData['f' + this.recordDataCount] = data
        this.recordData.push(data)
        this.recordDataCount++
      }
    },

    updateRecordStop(){
      if(this.enableDataRecord){
        let temp = {
          'frames': []
        }

        // Parse for Unity
        for(let i = 0; i < this.recordData.length; i++) {
          let multiPoseTemp = {
            'poses': []
          }
          for(let j = 0; j < this.recordData[i].length; j++){
            multiPoseTemp.poses.push(this.recordData[i][j])
          }
          temp.frames.push(multiPoseTemp)
        }

        let blob = new Blob([JSON.stringify(temp, null, '  ')], {type: 'application\/json'})
        this.recordDataBlob = window.URL.createObjectURL(blob)
      }

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
