for i in client/*; do ex $i << !FIN!
%s/myCarousel/my-carousel/g
w
!FIN!
done
