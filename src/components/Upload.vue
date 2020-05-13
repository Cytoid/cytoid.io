<script>
import Captcha from '@/components/Captcha'
export default {
  name: 'Upload',
  components: {
    Captcha,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: false,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: null,
    },
    accept: {
      type: String,
      default: null,
    },
    background: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    subtitle: {
      type: String,
      default: null,
    },
    callback: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      state: null,
      progress: null,
      error: null,
    }
  },
  computed: {
    loadingPrompt() {
      switch (this.state) {
        case 1:
          return 'Verifying request'
        case 2:
          return 'Creating file entry'
        case 3:
          return 'Uploading file'
        case 4:
          return 'Checking file'
        case 5:
          return 'Post-processing'
      }
      return null
    }
  },
  methods: {
    async upload(file) {
      try {
        this.state = 1
        const captcha = await this.$refs.captcha.execute()
        this.state = 2
        const res = await this.$axios.post('/files/' + this.type, {
          filename: file.name,
          contentType: file.type,
          captcha,
        })
        this.state = 3
        await this.$axios.put(res.data.uploadURL, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            this.progress = (progressEvent.loaded / progressEvent.total) * 100
          }
        })
        this.progress = null
        this.state = 4
        await this.$axios.put('/files/' + res.data.path, {
          token: res.data.token,
        })

        if (this.callback) {
          this.state = 5
          this.$emit('upload', {
            ...res.data,
            callback: () => {
              this.state = null
            }
          })
        } else {
          this.state = null
          this.$emit('upload', res.data.path)
        }
      } catch (e) {
        this.state = null
        this.progress = null
        this.error = e.message
        this.$buefy.toast.open({
          message: e.message,
          type: 'is-danger'
        })
      }
    }
  },
  render(h) {
    return <div>
      <captcha size="invisible" ref="captcha" />
      <b-upload
        class="bg-upload"
        drag-drop
        value={this.value}
        vOn:input={this.upload}
        name={this.name}
        disabled={this.disabled}
        accept={this.accept}
        type={this.error ? 'is-danger' : 'is-primary'}
      >
        {this.background && <img
          class={{
            'bg-upload-image': true,
            darken: !this.icon,
          }}
          src={this.background}
        />}
        {
          !this.icon && <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon
                  icon="upload"
                  size="is-large">
                </b-icon>
              </p>
              <h4 class="is-size-5">{this.$slots.title || this.title || this.$t('file_upload_default_title')}</h4>
              <p>{this.$slots.subtitle || this.subtitle || this.$t('file_upload_default_subtitle')}</p>
            </div>
            {this.state && [
              <progress class="progress" max="100" value={this.progress}></progress>,
              <small class="is-hint is-size-7">{this.loadingPrompt}</small>
            ]}
            {this.error && <p class="has-text-danger is-hint has-text-weight-bold">{this.error}</p>}
          </section>
        }

      </b-upload>
    </div>
  }
}
</script>

<style lang="scss">
.bg-upload {
  display: block !important;
  .upload-draggable {
    transition: border 250ms ease-out;
    overflow: hidden;
    position: relative;
  }
  .bg-upload-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    &.darken {
      filter: blur(5px) brightness(0.5);
    }
  }
  .section {
    position: relative;
    z-index: 1;
    .progress {
      width: 100%;
      margin-top: 1rem;
    }
    .is-hint {
      display: block;
      text-align: center;
    }
  }
  a {
    text-decoration: underline;
    &:hover {
      font-weight: bold;
    }
  }
}
</style>
