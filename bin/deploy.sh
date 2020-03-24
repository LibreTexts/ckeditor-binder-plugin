HOME_DIR=/home/jupyterteam

ssh -tt jupyterteam@test.libretexts.org << EOF
cd $HOME_DIR/ckeditor-binder-plugin
git fetch --all
git checkout staging && git reset --hard origin/staging
yarn install
yarn build
cp build/js/registerPlugin.min.js* $HOME_DIR/public
exit
EOF

