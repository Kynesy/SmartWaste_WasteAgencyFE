export default class TspGreedy{

    findOptimalSolution(distances: number[][]){
        var feasibleSolutions: any[] = []; //contiene tutte le soluzioni

        //risolviamo il problema partendo dal primo punto
        var tmpSolution = this.solveTsp(0, distances);
        var bestSolutionIndex: number = 0;
        var bestSolutionDistance: number = tmpSolution.distance;
        feasibleSolutions.push(tmpSolution);

        //risolviamo il problema partendo da ogni altro punto escluso il primo
        for(var i = 1; i<distances.length; i++){
            tmpSolution = this.solveTsp(i, distances);

            //se la soluzione percorre una distanza minore, si aggiorna l'indice della soluzione migliore
            if(tmpSolution.distance < bestSolutionDistance){
                bestSolutionIndex = i;
            }

            feasibleSolutions.push(tmpSolution);
        }

        console.log(feasibleSolutions);
        
        return feasibleSolutions[bestSolutionIndex];
    }

    private solveTsp(start: number, distances: number[][]){
        var visitedNodes: number[] = []; //conterrà l'ordine dei nodi visitati
        visitedNodes.push(start); //aggiungiamo il nodo iniziale
        var actualNode: number = start;

        //il loop continua finchè non si visitano tutti i nodi
        while(visitedNodes.length != distances.length){
            var nextNode = this.findNextNode(actualNode, visitedNodes, distances); //trova il nodo successivo
            actualNode = nextNode; // spostati nel nodo successivo
            visitedNodes.push(nextNode); //aggiungi il nodo successivo come visitato
        }

        var totalDistance = this.calculateTotalDistance(visitedNodes, distances);

        return {"path": visitedNodes, "distance": totalDistance}
        
    }

    private findNextNode(actualNode: number, visitedNodes: number[], distances: number[][]){
        var minDistance = undefined;
        var nextNode = undefined;

        for(var i = 0; i < distances[actualNode].length; i++){            
            if(!minDistance || minDistance > distances[actualNode][i]){
                if(!visitedNodes.includes(i))
                minDistance = distances[actualNode][i];
                nextNode = i;
            }
        }

        return nextNode!;
    }

    private calculateTotalDistance(path: number[], distances: number[][]){
        var totalDistance = 0;
        for(var i=1; i<path.length; i++){
            totalDistance = totalDistance + distances[i-1][i];
        }

        return totalDistance;
    }
}