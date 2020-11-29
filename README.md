# Online CUDA Occupancy Calculator

http://cuda.patwie.com/

Port of the [CUDA Occupancy Calculator spreadsheet](https://developer.download.nvidia.com/compute/cuda/CUDA_Occupancy_calculator.xls).

## Changes from xmartlabs-fork

* Extended until Compute Capabilities 7.0
* cleaned up d3js plots using c3js
* use a more recent css framework

## Compilation

```shell
coffee -c calculator.coffee
# gem install sass --no-user-install
sass -t compressed sass/materialize.scss > css/materialize.min.css
sass sass/materialize.scss > css/materialize.css
```

## Credits

* [Xmartlabs](https://xmartlabs.github.io/cuda-calculator)
* [Karthikeyan](https://github.com/lxkarthi/cuda-calculator) - Improved cuda-calculator online version.
* [Mihai Maruseac](https://github.com/mihaimaruseac/cuda-calculator) - Thanks for the fork.
* [Aliaksei](https://github.com/roadhump) - Original Author deleted it. :(
