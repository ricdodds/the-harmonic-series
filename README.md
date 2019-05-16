# The Harmonic Series at Lalalab

In this repo is hosted the code used [La La Lab](https://imaginary.org/event/la-la-lab-the-mathematics-of-music-at-mains-in-heidelberg) exhibtion.

## Looking Glass screen in Ubuntu 18.04

Install [Google Chrome](https://linuxize.com/post/how-to-install-google-chrome-web-browser-on-ubuntu-18-04/)

```bash
$ wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
$ sudo dpkg -i google-chrome-stable_current_amd64.deb
```

Install [Arduino](https://www.arduino.cc/en/Guide/Linux)

First download Arduino from https://www.arduino.cc/en/Main/Software

```bash
$ tar -xvf arduino-1.8.9-linux64.tar.xz
$ sudo ./arduino-1.8.9/install.sh
```

Change arduino port permissions
```bash
$ sudo chmod a+rw /dev/ttyACM0
```

Install Looking Glass driver for Linux

Download the driver from https://github.com/Looking-Glass/ThreeJsDriver/releases/tag/linux

```bash
$ tar -xvfz LKG_ThreeJsDriver_Lin_1.3.0b.tar.gz
$ sudo ./install.sh
```

Install [Node.js](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages)

```bash
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

## Setting Looking Glass screen resolution

Check the output where the screen is connectes with
```bash
$ xrandr
```

Assuming the screen output is `DP-1`:

```bash
$ xrandr --newmode "2560x1440_60.00"  312.25  2560 2752 3024 3488  1440 1443 1448 1493 -hsync +vsync
$ xrandr --addmode DP-1 "2560x1440_60.00"
$ xrandr --output DP-1 --mode "2560x1440_60.00"
```

## Running the app

Once all dependencies are installes you can run the app
```bash
$ npm start
```

and navigate to `localhost:3000` on Google Chrome.