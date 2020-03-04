*** npm 명령어 ***
npm init은 package.json을 만드는 명령어였죠? 새로운 프로젝트나 패키지를 만들 때 사용합니다.

npm install
    패키지를 설치하는 명령어입니다. 
    npm install 패키지@버전하면 특정한 버전을 설치할 수 있고, 
    npm install 주소하면 특정한 저장소에 있는 패키지를 설치할 수 있습니다. 
    주소는 주로 Github에만 있는 패키지를 설치할 때 사용합니다. 
    옵션을 줄 수 있는데 뒤에 --save 또는 -S를 하면 dependencies에(npm5부터는 --save옵션이 기본적으로 설정되어 있기 때문에 안 붙여도 됩니다), --save-dev 또는 -D하면 devDependencies에 추가됩니다. 
    그리고 -g를 하면 글로벌 패키지에 추가됩니다. 글로벌 패키지에 추가하면 이 프로젝트뿐만 아니라 다른 프로젝트도 해당 패키지를 사용할 수 있습니다.

npm update는 설치한 패키지를 업데이트하는 명령어입니다.

npm dedupe는 npm의 중복된 패키지들을 정리할 때 사용합니다. 가끔 쳐주면 용량도 줄이고 좋습니다.

npm docs는 패키지에 대한 설명을 보여줍니다. (https://docs.npmjs.com/)

