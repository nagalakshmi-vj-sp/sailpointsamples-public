
#! /bin/sh

# put this file in /etc/init.d/start_identitynow_syslog.sh


PATH=/bin:/usr/bin:/sbin:/usr/sbin

# the path to the run_identitynow_syslog.sh
DAEMON=/home/ubuntu/run_identitynow_syslog.sh
PIDFILE=/var/run/scriptname.pid

test -x $DAEMON || exit 0

. /lib/lsb/init-functions

case "$1" in
  start)
     log_daemon_msg "Starting IdentityNow Audit Syslog"
     start_daemon -p $PIDFILE $DAEMON
     log_end_msg $?
   ;;
  stop)
     log_daemon_msg "Stopping IdentityNow Audit Syslog"
     killproc -p $PIDFILE $DAEMON
     PID=`ps x |grep feed | identitynow -1 | awk '{print $1}'`
     kill -9 $PID       
     log_end_msg $?
   ;;
  force-reload|restart)
     $0 stop
     $0 start
   ;;
  status)
     status_of_proc -p $PIDFILE $DAEMON atd && exit 0 || exit $?
   ;;
 *)
   echo "Usage: /etc/init.d/atd {start|stop|restart|force-reload|status}"
   exit 1
  ;;
esac

exit 0