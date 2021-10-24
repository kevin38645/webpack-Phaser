const webpack = require("webpack");
const path = require("path");
const fs = require('fs')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


const tools = require('../src/model/tools')
const ejs = require('ejs')
const express = require('express');

module.exports = {
  mode: "development",
  devtool: "eval-source-map",

  //devServer既可做到app.js的功能，其他的require也是寫在這裡
  devServer: {
    inline: true,

    port: 8000,

    publicPath: '/',

    setup(app){
        app.set('views','./src/views')
        app.engine("html",ejs.__express)
        app.set("view engine","html")

        app.use(express.urlencoded({extended:false}))
        app.use(express.json())

        app.get("/", function(req, res){
            res.render("home")
        })

        app.get("/uploadFile", function(req, res){
          res.render("uploadFile")
        })

        app.get("/login", function(req, res){
          res.render("login")
        })

        let cpUpload = tools.multer().fields([{name: 'pic1',maxCount: 1 },{name:'pic2',maxCount:8}])
        app.post("/modifyFile", cpUpload, function(req, res){


            res.render("success")
        })

    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../")
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./src/views/index.html"
    })
  ]
};
