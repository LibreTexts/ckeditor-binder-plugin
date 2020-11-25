HOME_DIR=/home/jupyterteam
BRANCH=staging

if [ $# -eq 1 ]
then
  BRANCH=$1
fi

ssh -tt jupyterteam@test.libretexts.org << EOF
cd $HOME_DIR/ckeditor-binder-plugin
git fetch --all
git checkout $BRANCH && git reset --hard origin/$BRANCH
yarn install
yarn build
cp build/js/registerPlugin.min.js* $HOME_DIR/public
exit
EOF

