pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        sh 'pwd'
        checkout([
          $class: 'GitSCM',
          branches: [[name: env.GIT_BUILD_REF]],
          userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]]
        ])
        stash(name: 'repo')
      }
    }
    stage('Build') {
      agent {
        docker {
          image 'node:current'
        }
      }
      steps {
        echo 'Building...'
        unstash(name: 'repo')
        sh 'ls'
        sh 'node -v'
        sh 'yarn install --production=false'
        sh 'yarn generate'
        sh 'ls -a'
        echo 'Build Complete.'
        sh 'tar -zcvf client.tar.gz ./.nuxt/dist/client'
        sh 'tar -zcvf server.tar.gz ./.nuxt/dist/server'
        sh 'tar -zcvf site.tar.gz ./dist'
        archiveArtifacts(artifacts: 'site.tar.gz', fingerprint: true)
        archiveArtifacts(artifacts: 'client.tar.gz', fingerprint: true)
        archiveArtifacts(artifacts: 'server.tar.gz', fingerprint: true)
        sh 'rm site.tar.gz server.tar.gz client.tar.gz'
        stash(name: 'products')
      }
    }
    stage('Test') {
      steps {
        echo 'Unit Testing...'
        echo 'Testing Complete.'
      }
    }
    stage('Push') {
      steps {
        script {
          unstash(name: 'products')
          docker.withRegistry("https://cytoid-docker.pkg.coding.net", env.DOCKER_REGISTRY_CREDENTIALS_ID) {
            docker.build("cytoid-docker.pkg.coding.net/${DEPOT_NAME}/web/ssr:latest").push()
          }
        }
      }
    }
    stage('Deploy') {
      agent {
        docker {
          image 'node:current'
        }
      }
      steps {
        echo 'Deploying...'
        unstash(name: 'products')
        sh 'ls'
        sh 'node deploy.js static ./.nuxt/dist/client'
        sh 'node deploy.js site ./dist'
        sh 'curl -X POST https://server.cytoid.cn/docker/api/webhooks/050e1bc7-ce02-49fc-bf1c-6b555d9ed972'
        echo 'Deployed'
      }
    }
  }
  environment {
    NODE_ENV = 'production'
  }
}
