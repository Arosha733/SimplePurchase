pipeline {
    agent any
    environment {
        GITHUB_CREDENTIALS = 'Git Token'  // Use your actual credentials ID
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Checkout the code from GitHub using the credentials
                    git credentialsId: GITHUB_CREDENTIALS, url: 'https://github.com/Arosha733/Purchase-respo.git'
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    // Add build command for your microservice (ensure this file exists)
                    sh './build.sh'  // Replace with your actual build command
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    // Run tests for your microservice (ensure this file exists)
                    sh './test.sh'  // Replace with your actual test command
                }
            }
        }
        
        stage('Package') {
            steps {
                script {
                    // Package your application (ensure this file exists)
                    sh './package.sh'  // Replace with your actual packaging command
                }
            }
        }
        
        stage('Notify GitHub') {
            steps {
                script {
                    // Notify GitHub pull request status (optional, ensure GitHub plugin is set up)
                    githubNotify status: 'success', context: 'Jenkins', description: 'Build Succeeded', url: 'http://your-jenkins-server'
                }
            }
        }
    }
    post {
        success {
            // Notify reviewers if the build is successful
            script {
                // GitHub plugin notifications (adjust based on plugin setup)
                githubNotify status: 'success', context: 'Build', description: 'Build successful', url: 'http://your-jenkins-server'
            }
        }
        failure {
            // Notify reviewers if the build fails
            script {
                githubNotify status: 'failure', context: 'Build', description: 'Build failed', url: 'http://your-jenkins-server'
            }
        }
    }
}
