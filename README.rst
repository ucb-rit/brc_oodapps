
Open OnDemand apps
==================

For production env
------------------

- ood.brc
- (maybe n0160.svio1)

Dir:
/var/www/ood/apps/sys/brc_oodapps

Owned by root, run git fetch to update.  use 'main' branch.

OOD server log: TBD

tag the commit being deployed, for easy reverting, etc.

    git tag -a prod2021_1005 502a268 -m "production_2021_10_05"
    git tag -a prod2021_0924 9c7245e -m "production_2021_09_24"



For dev env
-----------


as user:
cd ~/ondemand/
git clone https://github.com/ucb-rit/brc_oodapps.git
ln -s brc_oodapps dev

note that user already has ~/ondemand/data if they were previous job/sessions.
need to end up with a structure 
~/ondemand/dev/brc_jupyter-compute 
~/ondemand/dev/brc_jupyter-lha
etc

sys admin add sym link on ood main/web server:
lrwxrwxrwx 1 root root 35 Sep 24 15:03 /var/www/ood/apps/dev/tin/gateway -> /global/home/users/tin/ondemand/dev

hmm... could it be:
lrwxrwxrwx 1 root root 35 Sep 24 15:03 /var/www/ood/apps/dev/tin/gateway -> /global/home/users/tin/ondemand/brc_oodapps
or
lrwxrwxrwx 1 root root 35 Sep 24 15:03 /var/www/ood/apps/dev/tin/gateway -> /global/home/users/tin/ondemand/dev/brc_oodapps

