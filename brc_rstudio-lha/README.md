# Batch Connect - BRC RStudio Server

RStudio Server app for Open OnDemand on the BRC clusters that uses the Linux host adapter.

Based on https://github.com/mcw-rcc/bc_rcc_rstudio_server, which is based on https://github.com/OSC/bc_osc_rstudio_server.

# Description

This provides an RStudio Server app tailored for BRC that uses the system R (and a system-installed RStudio Server) rather than providing R/RStudio in a container. The benefits of this over a container-based approach include:

 - Access to the same version of R as users are used to via the module system, including use of the heavily-optimized, threaded Intel MKL BLAS and LAPACK linear algebra packages rather than the much slower, non-threaded BLAS and LAPACK that come by default with R.
 - Access to the set of core R packages provided in the r-packages and r-spatial modules. 
 - Avoiding having user confusion from the local filesystem of the OOD app be inside the container.

# Instructions

These comments indicate what needs to be done for the Savio RStudio app relative to the template provided in the [MCW app](https://github.com/mcw-rcc/bc_rcc_rstudio_server).

1. Install RStudio Server in a module, as shown in the consultsw module farm, at `scripts/rstudio-server/2022.07.2-576`. Note that just dumps the binaries from the rpm onto the filesystem. 
2. As of version 1.4 (I think) RStudio Server needs to dynamically link to a Postgres library, libpq (64-bit version). The HPCS team installs this in `/global/software/sl-7.x86_64/modules/langs/r/${R_VERSION}/postgres-lib64`.
3. Modify `template/script.sh.erb` as needed for `rserver` and `rsession` processes to start. For `2022.07.2-576` we need to set `--auth-none 1` (to avoid RStudio prompting user to provide username/password), `-database-config-file "${DBCONF}"` (and associated stanza earlier to set `${DBCONF}`) and `--server-user $(whoami)` (so `rserver` doesn't try to run as non-existent `rstudio-server` user.
4. Modify `template/script.sh.erb` to load modules and set R library search path details.
5. Make sure that `template/bin/auth` uses `-lt` as discussed [here](https://discourse.osc.edu/t/rstudio-server-app-using-non-local-r/1223/3).
6. Modify `form.yml.erb` to build on existing Savio RStudio OOD config to reflect the Savio config. Set variables for the versions of RStudio Server, R, and R-spatial.

# Todo

- Set up the widget so users can choose the version of R they want. We'll need to dynamically determine which version of r-spatial to use and what the user's `R_LIBS_USER` should be, i.e., `~/R/x86_64-pc-linux-gnu-library/<RVERSION>`.


